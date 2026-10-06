"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { livePayload } from "@/lib/live";
import {
  claudeChannel,
  ntfyAudienceChannel,
  ntfyHostChannel,
  parseAudienceHash,
  type LiveChannel,
} from "@/lib/liveChannel";
import { useStore } from "../StoreProvider";

export type LiveRole = "pending" | "host" | "audience";

/**
 * 役割を決める。
 * - URL に参加者用の印（#live.…）があれば参加者画面（ログイン不要・ntfy.sh 経由）
 * - claude.ai 上ではオーナーが司会者、それ以外の閲覧者は参加者画面（共有データ経由）
 * - それ以外は司会者アプリ（ntfy.sh で配信）
 */
export function useLiveRole() {
  const [state, setState] = useState<{ role: LiveRole; channel: LiveChannel | null }>({
    role: "pending",
    channel: null,
  });

  useEffect(() => {
    let alive = true;
    const done = (role: LiveRole, channel: LiveChannel | null) => alive && setState({ role, channel });

    const aud = parseAudienceHash(window.location.hash);
    const claude = window.claude;
    (async () => {
      if (aud) {
        done("audience", crypto?.subtle ? ntfyAudienceChannel(aud.room, aud.pub) : null);
        return;
      }
      if (claude?.use) {
        const [user, db] = await Promise.all([
          claude.use("user").catch(() => null),
          claude.use("db").catch(() => null),
        ]);
        // 閲覧者の情報が取れない場合は、司会者アプリとして動かす（操作できなくなるのを防ぐ）
        const owner = user ? await user.isOwner().catch(() => false) : true;
        done(owner ? "host" : "audience", db ? claudeChannel(db) : null);
        return;
      }
      const base = window.location.href.split("#")[0];
      const ch = await ntfyHostChannel(base).catch(() => null);
      done("host", ch);
    })();
    return () => {
      alive = false;
    };
  }, []);

  return state;
}

export type LiveStatus = "off" | "connecting" | "live" | "error";
const LiveContext = createContext<{ status: LiveStatus; channel: LiveChannel | null }>({
  status: "off",
  channel: null,
});
export const useLive = () => useContext(LiveContext);
export const useLiveStatus = () => useContext(LiveContext).status;

/** 司会者の画面の変化を、参加者のスマホへ配信する */
export function LiveBroadcaster({ channel, children }: { channel: LiveChannel | null; children: ReactNode }) {
  const { loaded, game, graduates, settings, letters } = useStore();
  const offered = channel;
  // claude.ai 上は常に配信。ログイン不要版は司会者がオンにしたときだけ
  channel = channel && (channel.kind === "claude" || settings.liveOn) ? channel : null;
  const [status, setStatus] = useState<LiveStatus>(channel ? "connecting" : "off");
  useEffect(() => {
    if (!channel) setStatus("off");
    else setStatus((s) => (s === "off" ? "connecting" : s));
  }, [channel]);
  const payload = useMemo(
    () => (loaded ? livePayload(game, graduates, { shuffle: settings.shuffleFx !== false, letters }) : null),
    [loaded, game, graduates, settings.shuffleFx, letters],
  );
  const json = payload ? JSON.stringify(payload) : null;

  const ref = useRef({
    ready: false,
    inflight: false,
    lastSent: null as string | null,
    pending: null as string | null,
    retryDelay: 2000,
    retryTimer: undefined as ReturnType<typeof setTimeout> | undefined,
  });

  const flushRef = useRef<() => void>(() => {});
  flushRef.current = () => {
    const s = ref.current;
    if (!channel || !s.ready || s.inflight || !s.pending || s.pending === s.lastSent) return;
    clearTimeout(s.retryTimer);
    const body = s.pending;
    s.inflight = true;
    let failed = false;
    channel
      .send(JSON.parse(body))
      .then(
        () => {
          s.lastSent = body;
          s.retryDelay = 2000;
          setStatus("live");
        },
        () => {
          failed = true;
          setStatus("error");
        },
      )
      .finally(() => {
        s.inflight = false;
        if (failed) {
          // 回線が不安定でも、間隔を空けながら自動で送り直す（最新の内容だけを送る）
          s.retryTimer = setTimeout(() => flushRef.current(), s.retryDelay);
          s.retryDelay = Math.min(s.retryDelay * 2, 20000);
        } else if (s.pending !== s.lastSent) {
          // 送信中に画面が進んでいたら最新の内容を送る
          flushRef.current();
        }
      });
  };

  // 最初に、いま配信されている内容を読む（同じ内容を送り直さないため）
  useEffect(() => {
    if (!channel) {
      clearTimeout(ref.current.retryTimer);
      ref.current = { ...ref.current, ready: false, inflight: false, lastSent: null, pending: null, retryTimer: undefined };
      return;
    }
    let alive = true;
    ref.current.pending = json;
    channel
      .current()
      .then((p) => {
        if (alive && p) ref.current.lastSent = JSON.stringify(p);
      })
      .catch(() => {})
      .finally(() => {
        if (!alive) return;
        ref.current.ready = true;
        setStatus("live");
        flushRef.current();
      });
    return () => {
      alive = false;
      clearTimeout(ref.current.retryTimer);
    };
  }, [channel]);

  // 画面が変わったら配信（連打はまとめて1回にする）
  useEffect(() => {
    if (!channel || !json) return;
    ref.current.pending = json;
    const t = setTimeout(() => flushRef.current(), 250);
    return () => clearTimeout(t);
  }, [channel, json]);

  const value = useMemo(() => ({ status, channel: offered }), [status, offered]);
  return <LiveContext.Provider value={value}>{children}</LiveContext.Provider>;
}

/** 参加者用 QR パネルを開く（ログイン不要版のみ。使えないときは null） */
export const ShareContext = createContext<(() => void) | null>(null);
export const useOpenShare = () => useContext(ShareContext);
