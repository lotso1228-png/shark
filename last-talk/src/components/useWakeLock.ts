"use client";

import { useEffect } from "react";

type Sentinel = { release: () => Promise<void>; addEventListener: (t: string, f: () => void) => void };

/** 進行中にスマホの画面が消えないようにする（非対応・拒否された場合は何もしない） */
export function useWakeLock() {
  useEffect(() => {
    const nav = navigator as Navigator & { wakeLock?: { request: (t: "screen") => Promise<Sentinel> } };
    if (!nav.wakeLock) return;
    let sentinel: Sentinel | null = null;
    const request = async () => {
      if (sentinel || document.visibilityState !== "visible") return;
      try {
        sentinel = await nav.wakeLock!.request("screen");
        sentinel.addEventListener("release", () => (sentinel = null));
      } catch {
        /* 省電力モードなどで拒否されても動作は継続 */
      }
    };
    const onVisible = () => document.visibilityState === "visible" && request();
    request();
    // 最初のタップ後に改めて要求（ユーザー操作が必要なブラウザ向け）
    window.addEventListener("pointerdown", request);
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("pointerdown", request);
      document.removeEventListener("visibilitychange", onVisible);
      sentinel?.release().catch(() => {});
    };
  }, []);
}
