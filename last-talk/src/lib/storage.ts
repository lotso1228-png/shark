"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const PREFIX = "lasttalk:v1:";

export const STORAGE_KEYS = {
  graduates: `${PREFIX}graduates`,
  topics: `${PREFIX}topics`,
  settings: `${PREFIX}settings`,
  game: `${PREFIX}game`,
  members: `${PREFIX}members`,
} as const;

function read<T>(key: string): T | undefined {
  try {
    const raw = window.localStorage.getItem(key);
    return raw == null ? undefined : (JSON.parse(raw) as T);
  } catch {
    return undefined;
  }
}

function write(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* プライベートモード等で保存できなくても動作は継続する */
  }
}

/**
 * LocalStorage と同期する state。
 * 静的書き出しのため初回描画は fallback で行い、マウント後に保存値を読み込む。
 */
export function usePersistentState<T>(
  key: string,
  fallback: () => T,
  validate?: (v: unknown) => v is T,
) {
  const [value, setValue] = useState<T>(fallback);
  const [loaded, setLoaded] = useState(false);
  const fallbackRef = useRef(fallback);

  useEffect(() => {
    const stored = read<unknown>(key);
    if (stored !== undefined && (!validate || validate(stored))) {
      setValue(stored as T);
    } else {
      setValue(fallbackRef.current());
    }
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (loaded) write(key, value);
  }, [key, value, loaded]);

  const reset = useCallback(() => setValue(fallbackRef.current()), []);

  return [value, setValue, loaded, reset] as const;
}
