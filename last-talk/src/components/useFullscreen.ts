"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export function useFullscreen() {
  const [active, setActive] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    setSupported(!!document.documentElement.requestFullscreen);
    const onChange = () => setActive(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggle = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      /* iOS Safari など非対応の環境では何もしない */
    }
  }, []);

  return useMemo(() => ({ active, supported, toggle }), [active, supported, toggle]);
}

export type Fullscreen = ReturnType<typeof useFullscreen>;
