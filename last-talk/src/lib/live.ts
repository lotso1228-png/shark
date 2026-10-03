import { cardView } from "./cardView";
import { currentEntry } from "./engine";
import { FINALE_PROMPT } from "./topics";
import type { Category, GameState, Graduate } from "./types";

/**
 * 参加者のスマホに同時表示する内容。司会者の画面から作り、共有データとして配信する。
 * 名前とお題の文言だけを送る（卒業生の本名や進行の内部状態は送らない）。
 */
export interface LivePayload {
  v: 1;
  scene: "idle" | "select" | "ready" | "topic" | "last-intro" | "last-question" | "finale";
  /** 画面切り替えアニメーションの識別子 */
  key: string;
  name: string;
  label: string;
  sub: string;
  text: string;
  note: string;
  special: boolean;
  chapter: Category;
  names: string[];
}

const nameOf = (gs: Graduate[], id: string | null | undefined) => {
  const g = gs.find((x) => x.id === id);
  return g ? g.nickname.trim() || g.name.trim() : "";
};

export function livePayload(game: GameState, graduates: Graduate[]): LivePayload | null {
  const base: LivePayload = {
    v: 1,
    scene: "idle",
    key: "idle",
    name: "",
    label: "",
    sub: "",
    text: "",
    note: "",
    special: false,
    chapter: game.chapter,
    names: [],
  };
  const name = nameOf(graduates, game.graduateId);
  switch (game.screen) {
    case "setup":
      return null; // 設定中は参加者の画面をそのままにする
    case "top":
      return base;
    case "select":
      return { ...base, scene: "select", key: "select" };
    case "ready":
      return { ...base, scene: "ready", key: `ready-${game.graduateId}`, name };
    case "topic": {
      const entry = currentEntry(game);
      if (!entry) return { ...base, scene: "ready", key: `ready-${game.graduateId}`, name };
      const n = nameOf(graduates, entry.graduateId);
      const v = cardView(entry.card, n || "卒業生");
      return {
        ...base,
        scene: "topic",
        key: `topic-${game.cursor}-${v.text}`,
        name: n,
        label: v.label,
        sub: v.sub,
        text: v.text,
        note: v.note ?? "",
        special: v.special,
      };
    }
    case "last-intro":
      return { ...base, scene: "last-intro", key: `last-intro-${game.graduateId}`, name, text: FINALE_PROMPT };
    case "last-question":
      return {
        ...base,
        scene: "last-question",
        key: `last-q-${game.graduateId}-${game.lastCard?.text}`,
        name,
        text: game.lastCard?.text ?? "",
      };
    case "finale":
      return { ...base, scene: "finale", key: "finale", names: graduates.map((g) => nameOf(graduates, g.id)) };
  }
}

export const LIVE_DOC = "live/state";

export function isLivePayload(v: unknown): v is LivePayload {
  return !!v && typeof v === "object" && (v as LivePayload).v === 1 && typeof (v as LivePayload).scene === "string";
}
