"use client";

import { loadDefaultJapaneseParser } from "budoux";
import { Fragment } from "react";

const parser = loadDefaultJapaneseParser();
const cache = new Map<string, string[]>();

/** 文節に分ける（同じ文は使い回す） */
export function phrases(text: string): string[] {
  let p = cache.get(text);
  if (!p) {
    p = parser.parse(text);
    if (cache.size > 500) cache.clear();
    cache.set(text, p);
  }
  return p;
}

/**
 * 日本語を文節の切れ目でだけ改行する（「くだ／さい」のような途中改行を防ぐ）。
 * iPhone の Safari は word-break: auto-phrase に対応していないため、
 * 文節の間に <wbr> を入れ、文節の中では改行しない（keep-all）。
 * 1文節が行より長いときだけ、やむを得ず途中で折り返す（overflow-wrap: anywhere）。
 */
export function Jp({ children }: { children: string }) {
  const parts = phrases(children);
  return (
    <span className="jp">
      {parts.map((p, i) => (
        <Fragment key={i}>
          {i > 0 && <wbr />}
          <span className="ph">{p}</span>
        </Fragment>
      ))}
    </span>
  );
}
