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
  subscribe(
    next: (p: LivePayload | null) => void,
    status: (s: ChannelStatus) => void,
    onReaction?: (r: Reactions) => void,
  ): () => void;
  /** 参加者のリアクションを送る（対応している配信路のみ） */
  react?(kind: ReactionKind): void;
  /** 司会者側でリアクションを受け取る（対応している配信路のみ） */
  onReactions?(cb: (r: Reactions) => void): () => void;
}

export type ReactionKind = "clap" | "laugh" | "cry" | "fire";
export type Reactions = Partial<Record<ReactionKind, number>>;
export const REACTIONS: { kind: ReactionKind; emoji: string; label: string }[] = [
  { kind: "clap", emoji: "👏", label: "拍手" },
  { kind: "laugh", emoji: "😂", label: "爆笑" },
  { kind: "cry", emoji: "😭", label: "泣ける" },
  { kind: "fire", emoji: "🔥", label: "アツい" },
];

/** 受け取ったリアクションを検証する（各種類20まで） */
function parseReactions(raw: string, self: string): Reactions | null {
  try {
    const m = JSON.parse(raw) as { r?: Record<string, unknown>; s?: string };
    if (!m.r || typeof m.r !== "object" || m.s === self) return null;
    const out: Reactions = {};
    for (const { kind } of REACTIONS) {
      const n = Number(m.r[kind]);
      if (Number.isFinite(n) && n > 0) out[kind] = Math.min(20, Math.floor(n));
    }
    return Object.keys(out).length ? out : null;
  } catch {
    return null;
  }
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
const reactTopicOf = (room: string) => `lasttalk-${room}-r`;
const deviceId = Math.random().toString(36).slice(2, 10);

/**
 * ntfy.sh のトピックを購読する。つなぎっぱなし（SSE）が使えない回線では、
 * 数秒おきに最新を取りに行く方式（メインのトピックのみ）へ自動で切り替える。
 */
function ntfyStream(
  topics: string[],
  onMessage: (topic: string, message: string) => void,
  status: (s: ChannelStatus) => void,
  pollTopic?: string,
  /** 予備方式で、取りこぼしなく順に受け取るトピック（リアクションなど） */
  pollAll: string[] = [],
  /** 予備方式の問い合わせ間隔（ミリ秒） */
  pollEvery = 5000,
) {
  let es: EventSource | null = null;
  let alive = true;
  let delay = 4000;
  let fails = 0;
  let polling = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  // 予備方式：1回の問い合わせで全トピックの新着をまとめて受け取る（ntfy.sh の1台あたりの上限内に収める）
  const polled = [...(pollTopic ? [pollTopic] : []), ...pollAll];
  let sinceTime = Math.floor(Date.now() / 1000);
  const seenIds = new Set<string>();
  let first = true;
  const poll = async () => {
    if (!alive || polled.length === 0) return;
    let wait = pollEvery + Math.random() * 1500;
    try {
      // 初回だけ、メインのトピックは最新の1件を取り直す（途中参加でも今のお題を出す）
      if (first && pollTopic) {
        const res = await fetch(`${NTFY}/${pollTopic}/json?poll=1&since=latest`, { cache: "no-store" });
        if (res.ok) {
          const line = (await res.text()).trim().split("\n").pop();
          if (line) onMessage(pollTopic, JSON.parse(line).message);
        }
      }
      first = false;
      const res = await fetch(`${NTFY}/${polled.join(",")}/json?poll=1&since=${sinceTime}`, { cache: "no-store" });
      if (res.status === 429) throw Object.assign(new Error("rate"), { rate: true });
      if (!res.ok) throw new Error(String(res.status));
      for (const line of (await res.text()).trim().split("\n")) {
        if (!line) continue;
        const m = JSON.parse(line);
        if (m.event !== "message" || seenIds.has(m.id)) continue;
        seenIds.add(m.id);
        if (typeof m.time === "number") sinceTime = Math.max(sinceTime, m.time);
        onMessage(m.topic, m.message);
      }
      if (seenIds.size > 500) seenIds.clear();
      status("live");
    } catch (e) {
      if ((e as { rate?: boolean }).rate) wait = 20000 + Math.random() * 5000;
      status("offline");
    }
    if (alive) timer = setTimeout(poll, document.visibilityState === "visible" ? wait : wait * 3);
  };

  const connect = () => {
    if (!alive) return;
    status("connecting");
    let opened = false;
    es = new EventSource(`${NTFY}/${topics.join(",")}/sse`);
    es.onopen = () => {
      opened = true;
      fails = 0;
      delay = 4000;
      status("live");
    };
    es.onmessage = (ev) => {
      try {
        const m = JSON.parse(ev.data);
        if (m.event === "message" && typeof m.message === "string") onMessage(m.topic, m.message);
      } catch {
        /* 壊れたメッセージは無視 */
      }
    };
    es.onerror = () => {
      es?.close();
      es = null;
      if (!opened) fails++;
      // まだ一度もつながっていない間は「接続中」のまま（予備方式に切り替わるまでの数秒）
      status(opened ? "offline" : "connecting");
      if (fails >= 2 && (pollTopic || pollAll.length)) {
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
}

/** リアクションをまとめて送る（連打しても1.5秒に1回、混雑時は1分休む） */
function reactionSender(room: string) {
  let pending: Reactions = {};
  let timer: ReturnType<typeof setTimeout> | undefined;
  let pausedUntil = 0;
  const flush = async () => {
    timer = undefined;
    const body = pending;
    pending = {};
    if (!Object.keys(body).length || Date.now() < pausedUntil) return;
    try {
      const res = await fetch(`${NTFY}/${reactTopicOf(room)}`, {
        method: "POST",
        body: JSON.stringify({ r: body, s: deviceId }),
      });
      if (res.status === 429) pausedUntil = Date.now() + 60000;
    } catch {
      /* リアクションは届かなくても問題ない */
    }
  };
  return (kind: ReactionKind) => {
    pending[kind] = Math.min(20, (pending[kind] ?? 0) + 1);
    if (!timer) timer = setTimeout(flush, 1500);
  };
}

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
    onReactions(cb) {
      return ntfyStream(
        [reactTopicOf(r.room)],
        (_t, msg) => {
          const x = parseReactions(msg, deviceId);
          if (x) cb(x);
        },
        () => {},
        undefined,
        [reactTopicOf(r.room)],
        // 司会者の端末はお題の送信を最優先。リアクションの取得は控えめに
        11000,
      );
    },
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
    react: reactionSender(room),
    subscribe(next, status, onReaction) {
      let alive = true;
      const main = topicOf(room);
      const deliver = async (raw: string) => {
        const p = await open(raw);
        if (p !== undefined && alive) next(p);
      };
      // 途中から開いた人にも、いまのお題をすぐ出す
      fetch(`${NTFY}/${main}/json?poll=1&since=latest`, { cache: "no-store" })
        .then((res) => (res.ok ? res.text() : ""))
        .then((t) => {
          const line = t.trim().split("\n").pop();
          if (line) void deliver(JSON.parse(line).message);
        })
        .catch(() => {});
      const stop = ntfyStream(
        [main, reactTopicOf(room)],
        (topic, msg) => {
          if (topic === main) void deliver(msg);
          else if (onReaction) {
            const x = parseReactions(msg, deviceId);
            if (x) onReaction(x);
          }
        },
        status,
        main,
        [reactTopicOf(room)],
      );
      return () => {
        alive = false;
        stop();
      };
    },
  };
}
