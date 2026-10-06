import { PAST_DEFAULT_TEXTS } from "./pastTopics";
import { DEFAULT_TOPICS } from "./topics";
import type { Topic } from "./types";

const KNOWN_DEFAULTS = new Set([...PAST_DEFAULT_TEXTS, ...DEFAULT_TOPICS.map((t) => t.text)]);

/**
 * 標準お題の入れ替え。標準お題のうち、どの版の標準とも文言が違うもの（＝自分で編集したもの）と、
 * 自分で追加したお題は残す。編集済みの標準お題は、以後は自分のお題として扱う。
 */
export function upgradeTopics(list: Topic[]): Topic[] {
  const mine = list
    .filter((t) => !t.builtIn || t.edited || !KNOWN_DEFAULTS.has(t.text))
    .map((t) => (t.builtIn ? { ...t, builtIn: false, edited: true } : t));
  const mineTexts = new Set(mine.map((t) => t.text));
  return [...DEFAULT_TOPICS.filter((t) => !mineTexts.has(t.text)), ...mine];
}

