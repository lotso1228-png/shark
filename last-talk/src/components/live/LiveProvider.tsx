"use client";

import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { LiveDb } from "@/lib/claude";
import { LIVE_DOC, isLivePayload, livePayload } from "@/lib/live";
import { useStore } from "../StoreProvider";

export type LiveRole = "pending" | "standalone" | "host" | "audience";

/**
 * 公開ページ上ではオーナー（司会者）が操作し、それ以外の人は参加者画面になる。
 * claude.ai の外（単体ファイル・Next.js 版）ではこれまでどおり司会者アプリとして動く。
 */
export function useLiveRole() {
  const [state, setState] = useState<{ role: LiveRole; db: LiveDb | null }>(() => ({
    role: "pending",
    db: null,
  }));

  useEffect(() => {
    const claude = typeof window !== "undefined" ? window.claude : undefined;
    if (!claude?.use) {
      setState({ role: "standalone", db: null });
      return;
    }
    let alive = true;
    (async () => {
      const [user, db] = await Promise.all([
        claude.use("user").catch(() => null),
        claude.use("db").catch(() => null),
      ]);
      if (!alive) return;
      // 閲覧者の情報が取れない場合は、司会者アプリとして動かす（操作できなくなるのを防ぐ）
      const owner = user ? await user.isOwner().catch(() => false) : true;
      if (!alive) return;
      setState({ role: owner ? "host" : "audience", db });
    })();
    return () => {
      alive = false;
    };
  }, []);

  return state;
}

export type LiveStatus = "off" | "connecting" | "live" | "error";
const LiveStatusContext = createContext<LiveStatus>("off");
export const useLiveStatus = () => useContext(LiveStatusContext);

/** 司会者の画面の変化を、参加者のスマホへ配信する */
export function LiveBroadcaster({ db, children }: { db: LiveDb | null; children: ReactNode }) {
  const { loaded, game, graduates } = useStore();
  const [status, setStatus] = useState<LiveStatus>(db ? "connecting" : "off");
  const payload = useMemo(
    () => (loaded ? livePayload(game, graduates) : null),
    [loaded, game, graduates],
  );
  const json = payload ? JSON.stringify(payload) : null;

  const ref = useRef({ ready: false, inflight: false, lastSent: null as string | null, pending: null as string | null });

  const flushRef = useRef<() => void>(() => {});
  flushRef.current = () => {
    const s = ref.current;
    if (!db || !s.ready || s.inflight || !s.pending || s.pending === s.lastSent) return;
    const body = s.pending;
    s.inflight = true;
    let failed = false;
    const write = () => db.doc(LIVE_DOC).set(JSON.parse(body));
    write()
      .catch((e: { code?: string }) =>
        e?.code === "unavailable"
          ? new Promise<void>((r) => setTimeout(r, 400 + Math.random() * 600)).then(write)
          : Promise.reject(e),
      )
      .then(
        () => {
          s.lastSent = body;
          setStatus("live");
        },
        () => {
          failed = true;
          setStatus("error");
        },
      )
      .finally(() => {
        s.inflight = false;
        // 書き込み中に画面が進んでいたら最新の内容を送る（失敗時は次の操作で再送）
        if (!failed && s.pending !== s.lastSent) flushRef.current();
      });
  };

  // 最初に、いま配信されている内容を読む（同じ内容を書き直さないため）
  useEffect(() => {
    if (!db) return;
    let alive = true;
    db.doc(LIVE_DOC)
      .get()
      .then((snap) => {
        const d = snap.exists ? snap.data() : undefined;
        if (alive && isLivePayload(d)) ref.current.lastSent = JSON.stringify(d);
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
    };
  }, [db]);

  // 画面が変わったら配信（連打はまとめて1回にする）
  useEffect(() => {
    if (!db || !json) return;
    ref.current.pending = json;
    const t = setTimeout(() => flushRef.current(), 120);
    return () => clearTimeout(t);
  }, [db, json]);

  return <LiveStatusContext.Provider value={status}>{children}</LiveStatusContext.Provider>;
}
