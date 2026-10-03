import { CATEGORY_META, SPECIAL_META } from "./topics";
import type { Card } from "./types";

export interface CardView {
  label: string;
  sub: string;
  text: string;
  note: string | null;
  special: boolean;
}

/** カード1枚を画面表示用の文言に変換する（司会画面・参加者画面で共通） */
export function cardView(card: Card, name: string): CardView {
  switch (card.kind) {
    case "topic":
      return {
        label: CATEGORY_META[card.category].en,
        sub: CATEGORY_META[card.category].label,
        text: card.text,
        note: null,
        special: false,
      };
    case "special": {
      const m = SPECIAL_META[card.special];
      return {
        label: `Special · ${m.en}`,
        sub: m.label,
        text: m.text,
        note: m.sub.replaceAll("{name}", name),
        special: true,
      };
    }
    case "reply":
      return {
        label: "Reply",
        sub: "指名された方から",
        text: `${name}へ、一言。`,
        note: "指名された現役メンバーから、卒業生へ",
        special: true,
      };
  }
}
