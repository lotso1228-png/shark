import { cardView } from "./cardView";
import { currentEntry, hasScores, ranking } from "./engine";
import { FINALE_PROMPT } from "./topics";
import type { Category, GameState, Graduate, ReactionCounts } from "./types";

/**
 * 参加者のスマホに同時表示する内容。司会者の画面から作り、共有データとして配信する。
 * 名前とお題の文言だけを送る（卒業生の本名や進行の内部状態は送らない）。
 */
export interface LivePayload {
  v: 1;
  scene:
    | "idle"
    | "select"
    | "ready"
    | "topic"
    | "last-intro"
    | "last-question"
    | "award"
    | "finale";
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
  /** シャッフル演出を見せるか（司会者の設定） */
  shuffle?: boolean;
  /** 表示中カードのカテゴリー（シャッフル中に流すダミーのお題を選ぶため） */
  cat?: Category | "special";
  /** 卒業生ルーレット（select 画面で回っているとき） */
  roulette?: { id: string; winner: string };
  /** 現役ルーレットの指名（当たった人のスマホで知らせるため参加者IDも送る） */
  pick?: { id: string; memberId: string; name: string; names: string[] };
  /** 優勝発表（順位はリアクションの多い順） */
  award?: { revealed: boolean; rows: AwardEntry[] };
  /** フィナーレで表示する優勝者 */
  winners?: string[];
  /** 判定タイム（数の途中経過は送らず、開始と結果だけ送る） */
  judge?: { id: string; seconds: number; target: number; result?: "safe" | "out"; count?: number };
}

export interface AwardEntry {
  name: string;
  total: number;
  rank: number;
  counts: ReactionCounts;
}

const nameOf = (gs: Graduate[], id: string | null | undefined) => {
  const g = gs.find((x) => x.id === id);
  return g ? g.nickname.trim() || g.name.trim() : "";
};

export function livePayload(
  game: GameState,
  graduates: Graduate[],
  opts: { shuffle?: boolean } = {},
): LivePayload | null {
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
    shuffle: opts.shuffle ?? true,
  };
  const name = nameOf(graduates, game.graduateId);
  // 現役ルーレットの指名中は、どの画面でも参加者に知らせる
  const scene = build();
  if (!scene) return scene;
  const j = game.judge;
  return {
    ...scene,
    ...(game.memberPick ? { pick: game.memberPick } : {}),
    ...(j
      ? {
          judge: {
            id: j.id,
            seconds: j.seconds,
            target: j.target,
            ...(j.result ? { result: j.result, count: j.count } : {}),
          },
        }
      : {}),
  };

  function awardRows(): AwardEntry[] {
    return ranking(game, graduates).map((r) => ({
      name: nameOf(graduates, r.id),
      total: r.total,
      rank: r.rank,
      counts: r.counts,
    }));
  }
  function winnersOf(): string[] {
    return hasScores(game) ? awardRows().filter((r) => r.rank === 1).map((r) => r.name) : [];
  }

  function build(): LivePayload | null {
    switch (game.screen) {
      case "setup":
        return null; // 設定中は参加者の画面をそのままにする
      case "top":
        return base;
      case "select":
        return game.roulette
          ? {
              ...base,
              scene: "select",
              key: `select-${game.roulette.id}`,
              names: graduates.map((g) => nameOf(graduates, g.id)),
              roulette: {
                id: game.roulette.id,
                winner: nameOf(graduates, game.roulette.winnerId),
              },
            }
          : {
              ...base,
              scene: "select",
              key: "select",
              names: graduates.map((g) => nameOf(graduates, g.id)),
            };
      case "ready":
        return {
          ...base,
          scene: "ready",
          key: `ready-${game.graduateId}`,
          name,
        };
      case "topic": {
        const entry = currentEntry(game);
        if (!entry)
          return {
            ...base,
            scene: "ready",
            key: `ready-${game.graduateId}`,
            name,
          };
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
          cat: entry.card.kind === "topic" ? entry.card.category : "special",
          shuffle: base.shuffle && entry.card.kind !== "reply",
        };
      }
      case "last-intro":
        return {
          ...base,
          scene: "last-intro",
          key: `last-intro-${game.graduateId}`,
          name,
          text: FINALE_PROMPT,
        };
      case "last-question":
        return {
          ...base,
          scene: "last-question",
          key: `last-q-${game.graduateId}-${game.lastCard?.text}`,
          name,
          text: game.lastCard?.text ?? "",
        };
      case "award":
        return {
          ...base,
          scene: "award",
          key: `award-${game.awardRevealed ? "open" : "wait"}`,
          award: { revealed: !!game.awardRevealed, rows: awardRows() },
        };
      case "finale":
        return {
          ...base,
          scene: "finale",
          key: "finale",
          names: graduates.map((g) => nameOf(graduates, g.id)),
          winners: winnersOf(),
        };
    }
  }
}

export const LIVE_DOC = "live/state";

export function isLivePayload(v: unknown): v is LivePayload {
  return (
    !!v &&
    typeof v === "object" &&
    (v as LivePayload).v === 1 &&
    typeof (v as LivePayload).scene === "string"
  );
}
