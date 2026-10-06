"use client";

import { useLayoutEffect, type DependencyList, type RefObject } from "react";

/**
 * 長いお題（カスタムお題など）が表示領域からはみ出さないよう、
 * CSS 変数 --fit で文字サイズを段階的に縮める。短いお題は縮めない。
 */
export function useFitText(ref: RefObject<HTMLElement | null>, deps: DependencyList) {
  useLayoutEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;

    const fit = () => {
      let scale = 1;
      el.style.setProperty("--fit", "1");
      for (
        let i = 0;
        i < 16 &&
        (el.scrollHeight > parent.clientHeight * 0.96 || el.scrollWidth > parent.clientWidth + 1);
        i++
      ) {
        scale *= 0.92;
        el.style.setProperty("--fit", scale.toFixed(3));
      }
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(parent);
    ro.observe(el); // シャッフル演出のあと本命のお題に切り替わったときも測り直す
    let alive = true;
    document.fonts?.ready.then(() => alive && fit());
    return () => {
      alive = false;
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
