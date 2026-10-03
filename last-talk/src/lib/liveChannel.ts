import type { LiveDb } from "./claude";
import { LIVE_DOC, isLivePayload, type LivePayload } from "./live";

export type ChannelStatus = "connecting" | "live" | "offline" | "error";

/** 司会者 → 参加者の配信路。claude.ai 上では共有データ、それ以外では ntfy.sh を使う */
export interface LiveChannel {
  kind: "claude" | "ntfy";
  /** 参加者に配る URL（ntfy のみ） */
  shareUrl?: string;
  send(p: LivePayload): Promise<void>;
  current(): Promise<LivePayload | null>;
  subscribe(next: (p: LivePayload | null) => void, status: (s: ChannelStatus) => void): () => void;
}

/* ───────── claude.ai（ログインした参加者向け） ───────── */

export function claudeChannel(db: LiveDb): LiveChannel {
  const ref = () => db.doc(LIVE_DOC);
  return {
    kind: "claude",
    send: (p) => ref().set({ ...p }),
    current: async () => {
      const s = await ref().get();
      const d = s.exists ? s.data() : undefined;
      return isLivePayload(d) ? d : null;
    },
    subscribe(next, status) {
      let unsub: (() => void) | null = null;
      let alive = true;
      const go = () => {
        unsub = ref().onSnapshot(
          (snap) => {
            const d = snap.exists ? snap.data() : undefined;
            next(isLivePayload(d) ? d : null);
            status("live");
          },
          (e) => {
            status("offline");
            if (alive && e.code === "unavailable") setTimeout(go, 3000);
          },
        );
      };
      go();
      return () => {
        alive = false;
        unsub?.();
      };
    },
  };
}

/* ───────── ntfy.sh（ログイン不要） ─────────
 * 誰でも同じトピックに書き込めるため、司会者の端末で作った鍵で署名し、
 * 参加者は署名を確かめたメッセージだけを表示する。 */

const NTFY = "https://ntfy.sh";
const ROOM_KEY = "lasttalk:v1:room";

const b64u = {
  enc: (buf: ArrayBuffer) =>
    btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""),
  dec: (s: string) => {
    const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4));
    return Uint8Array.from(bin, (c) => c.charCodeAt(0));
  },
};
const ALG = { name: "ECDSA", namedCurve: "P-256" } as const;
const SIG = { name: "ECDSA", hash: "SHA-256" } as const;
const enc = new TextEncoder();

interface Envelope {
  t: number;
  p: string;
  s: string;
}

const topicOf = (room: string) => `lasttalk-${room}`;

/** 参加者用 URL のハッシュ部分：#live.<ルームID>.<公開鍵> */
export function parseAudienceHash(hash: string): { room: string; pub: string } | null {
  const m = /^#live\.([a-z0-9]{8,32})\.([A-Za-z0-9_-]{80,100})$/.exec(hash);
  return m ? { room: m[1], pub: m[2] } : null;
}

interface StoredRoom {
  room: string;
  pub: string;
  priv: JsonWebKey;
}

async function loadOrCreateRoom(): Promise<StoredRoom> {
  try {
    const raw = localStorage.getItem(ROOM_KEY);
    if (raw) {
      const r = JSON.parse(raw) as StoredRoom;
      if (r.room && r.pub && r.priv) return r;
    }
  } catch {
    /* 作り直す */
  }
  const pair = await crypto.subtle.generateKey(ALG, true, ["sign", "verify"]);
  const pub = b64u.enc(await crypto.subtle.exportKey("raw", pair.publicKey));
  const priv = await crypto.subtle.exportKey("jwk", pair.privateKey);
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const room = Array.from(bytes, (b) => "abcdefghijkmnpqrstuvwxyz23456789"[b % 32]).join("");
  const r = { room, pub, priv };
  try {
    localStorage.setItem(ROOM_KEY, JSON.stringify(r));
  } catch {
    /* 保存できなくても今回の配信は動く */
  }
  return r;
}

async function readLatest(room: string): Promise<Envelope | null> {
  const res = await fetch(`${NTFY}/${topicOf(room)}/json?poll=1&since=latest`);
  if (!res.ok) return null;
  const line = (await res.text()).trim().split("\n").pop();
  if (!line) return null;
  try {
    return JSON.parse(JSON.parse(line).message) as Envelope;
  } catch {
    return null;
  }
}

/** 司会者側（署名して送る） */
export async function ntfyHostChannel(baseUrl: string): Promise<LiveChannel | null> {
  if (!crypto?.subtle) return null;
  const r = await loadOrCreateRoom();
  const key = await crypto.subtle.importKey("jwk", r.priv, ALG, false, ["sign"]);
  return {
    kind: "ntfy",
    shareUrl: `${baseUrl}#live.${r.room}.${r.pub}`,
    async send(p) {
      const body = JSON.stringify(p);
      const t = Date.now();
      const s = b64u.enc(await crypto.subtle.sign(SIG, key, enc.encode(`${t}.${body}`)));
      const res = await fetch(`${NTFY}/${topicOf(r.room)}`, {
        method: "POST",
        body: JSON.stringify({ t, p: body, s } satisfies Envelope),
      });
      if (!res.ok) throw Object.assign(new Error(`ntfy ${res.status}`), { code: res.status === 429 ? "rate" : "unavailable" });
    },
    async current() {
      const e = await readLatest(r.room).catch(() => null);
      if (!e) return null;
      try {
        const p = JSON.parse(e.p);
        return isLivePayload(p) ? p : null;
      } catch {
        return null;
      }
    },
    subscribe: () => () => {},
  };
}

/** 参加者側（受け取って署名を確かめる） */
export function ntfyAudienceChannel(room: string, pub: string): LiveChannel {
  const keyP = crypto.subtle.importKey("raw", b64u.dec(pub), ALG, false, ["verify"]);
  let lastT = 0;
  const open = async (raw: string): Promise<LivePayload | null | undefined> => {
    try {
      const e = JSON.parse(raw) as Envelope;
      if (typeof e.t !== "number" || typeof e.p !== "string" || typeof e.s !== "string") return undefined;
      const ok = await crypto.subtle.verify(SIG, await keyP, b64u.dec(e.s), enc.encode(`${e.t}.${e.p}`));
      if (!ok || e.t < lastT) return undefined; // 署名のない・古いメッセージは無視
      lastT = e.t;
      const p = JSON.parse(e.p);
      return isLivePayload(p) ? p : undefined;
    } catch {
      return undefined;
    }
  };
  return {
    kind: "ntfy",
    send: async () => {},
    current: async () => null,
    subscribe(next, status) {
      let es: EventSource | null = null;
      let alive = true;
      let delay = 4000;
      let fails = 0;
      let polling = false;
      let timer: ReturnType<typeof setTimeout> | undefined;

      const deliver = async (raw: string) => {
        const p = await open(raw);
        if (p !== undefined && alive) next(p);
      };

      // 予備：つなぎっぱなしの接続が使えない回線では、数秒おきに最新を取りに行く
      const poll = async () => {
        if (!alive) return;
        let wait = 4000 + Math.random() * 1500;
        try {
          const res = await fetch(`${NTFY}/${topicOf(room)}/json?poll=1&since=latest`, { cache: "no-store" });
          if (res.status === 429) {
            wait = 15000 + Math.random() * 5000;
            status("offline");
          } else if (res.ok) {
            status("live");
            const line = (await res.text()).trim().split("\n").pop();
            if (line) await deliver(JSON.parse(line).message);
          } else status("offline");
        } catch {
          status("offline");
        }
        if (alive) timer = setTimeout(poll, document.visibilityState === "visible" ? wait : wait * 3);
      };

      const connect = () => {
        if (!alive) return;
        status("connecting");
        let opened = false;
        es = new EventSource(`${NTFY}/${topicOf(room)}/sse?since=latest`);
        es.onopen = () => {
          opened = true;
          fails = 0;
          delay = 4000;
          status("live");
        };
        es.onmessage = (ev) => {
          try {
            const m = JSON.parse(ev.data);
            if (m.event === "message") void deliver(m.message);
          } catch {
            /* 壊れたメッセージは無視 */
          }
        };
        es.onerror = () => {
          es?.close();
          es = null;
          if (!opened) fails++;
          status("offline");
          if (fails >= 2) {
            polling = true;
            void poll();
            return;
          }
          // 会場の回線が混んでいても負荷をかけすぎないよう、間隔を空けて再接続
          timer = setTimeout(connect, delay);
          delay = Math.min(delay * 2, 60000);
        };
      };
      connect();

      const onVisible = () => {
        if (document.visibilityState !== "visible" || polling || es) return;
        clearTimeout(timer);
        delay = 4000;
        connect();
      };
      document.addEventListener("visibilitychange", onVisible);
      return () => {
        alive = false;
        clearTimeout(timer);
        es?.close();
        document.removeEventListener("visibilitychange", onVisible);
      };
    },
  };
}
