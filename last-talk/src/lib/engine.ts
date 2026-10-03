import { CATEGORY_ORDER } from "./topics";
import type {
  Card,
  Category,
  GameState,
  Graduate,
  HistoryEntry,
  Mood,
  SpecialKind,
  Topic,
} from "./types";

export type Rng = () => number;

export const initialGame = (): GameState => ({
  screen: "top",
  graduateId: null,
  chapter: "laugh",
  chapterCount: 0,
  chapterLocked: false,
  usedTopicIds: [],
  history: [],
  cursor: -1,
  lastDone: [],
  lastCard: null,
  lastRevealed: false,
});

/** 1章あたりのお題数。卒業生が多いほど1章を長くし、全員に各章が回るようにする */
export const chapterQuota = (graduateCount: number) =>
  Math.min(10, Math.max(4, graduateCount));

/** 自動進行の最終章。LAST MESSAGE はクライマックス用に温存する */
const AUTO_LAST_CHAPTER: Category = "friends";

export const isFlowComplete = (g: GameState, graduateCount: number) =>
  g.chapter === AUTO_LAST_CHAPTER && g.chapterCount >= chapterQuota(graduateCount);

export const currentEntry = (g: GameState): HistoryEntry | null =>
  g.cursor >= 0 ? g.history[g.cursor] ?? null : null;

/** 最近表示したお題ID（古い順） */
export const recentTopicIds = (g: GameState) =>
  g.history
    .slice(0, g.cursor + 1)
    .flatMap((h) => (h.card.kind === "topic" ? [h.card.topicId] : []))
    .slice(-12);

export const countFor = (g: GameState, graduateId: string) =>
  g.history.filter((h) => h.graduateId === graduateId && h.card.kind !== "reply").length;

function weightedPick<T>(items: T[], weight: (t: T) => number, rng: Rng): T | null {
  const total = items.reduce((s, t) => s + weight(t), 0);
  if (items.length === 0 || total <= 0) return null;
  let r = rng() * total;
  for (const t of items) {
    r -= weight(t);
    if (r < 0) return t;
  }
  return items[items.length - 1];
}

/**
 * 指定カテゴリーから未使用のお題を1つ引く。
 * そのカテゴリーを使い切った場合のみ、そのカテゴリーの使用履歴をリセットする。
 * リセット直後でも、最近表示したお題（recent）は短時間で再登場しないよう後回しにする。
 */
export function pickTopic(
  topics: Topic[],
  category: Category,
  used: string[],
  mood: Mood,
  rng: Rng,
  recent: string[] = [],
): { topic: Topic; used: string[] } | null {
  const inCat = topics.filter((t) => t.category === category);
  if (inCat.length === 0) return null;
  let usedNext = used;
  let pool = inCat.filter((t) => !used.includes(t.id));
  if (pool.length === 0) {
    const ids = new Set(inCat.map((t) => t.id));
    usedNext = used.filter((id) => !ids.has(id));
    // カテゴリーの半分までは「最近出たお題」を除外する（最低でも直前の1枚は必ず除外）
    const keep = Math.max(1, Math.floor(inCat.length / 2));
    const avoid = new Set(recent.slice(-keep));
    pool = inCat.filter((t) => !avoid.has(t.id));
    if (pool.length === 0) pool = inCat;
  }
  const topic = weightedPick(
    pool,
    (t) => {
      if (mood === "hype" && t.tags.includes("hype")) return 3;
      if (mood === "calm" && t.tags.includes("calm")) return 3;
      return 1;
    },
    rng,
  )!;
  return { topic, used: [...usedNext, topic.id] };
}

const SPECIAL_RATE: Record<Mood, number> = { normal: 0.1, hype: 0.16, calm: 0.08 };
const SPECIAL_WEIGHT: Record<Mood, Record<SpecialKind, number>> = {
  normal: { nominate: 1, reverse: 1, everyone: 1, photo: 1 },
  hype: { nominate: 3, reverse: 2, everyone: 2, photo: 1 },
  calm: { nominate: 1, reverse: 0.5, everyone: 2, photo: 3 },
};

export const pickSpecial = (mood: Mood, rng: Rng): SpecialKind =>
  weightedPick<SpecialKind>(
    ["nominate", "reverse", "everyone", "photo"],
    (k) => SPECIAL_WEIGHT[mood][k],
    rng,
  )!;

/** 気分モードを反映して、今回引くカテゴリーを決める */
function resolveCategory(g: GameState, mood: Mood, rng: Rng): Category {
  if (g.chapterLocked) return g.chapter;
  if (mood === "hype" && g.chapter !== "laugh" && rng() < 0.4) return "laugh";
  if (mood === "calm" && g.chapter === "laugh" && rng() < 0.5) return "memory";
  return g.chapter;
}

const hasUnused = (topics: Topic[], category: Category, used: string[]) =>
  topics.some((t) => t.category === category && !used.includes(t.id));

export interface DrawContext {
  topics: Topic[];
  graduates: Graduate[];
  mood: Mood;
  rng?: Rng;
  /** 特別カードを強制（司会メニュー用）。"random" で種類はランダム */
  forceSpecial?: SpecialKind | "random";
  /** 特別カードを出さない（司会者がカテゴリーを指定した直後など） */
  noSpecial?: boolean;
}

/** 新しいカードを引いて履歴に積む（現在位置より先の履歴は破棄） */
export function draw(g: GameState, ctx: DrawContext): GameState {
  const rng = ctx.rng ?? Math.random;
  const graduateId = g.graduateId;
  if (!graduateId) return g;

  let { chapter, chapterCount } = g;
  if (!g.chapterLocked) {
    const quota = chapterQuota(ctx.graduates.length);
    const idx = CATEGORY_ORDER.indexOf(chapter);
    const lastAuto = CATEGORY_ORDER.indexOf(AUTO_LAST_CHAPTER);
    if (chapterCount >= quota && idx < lastAuto) {
      chapter = CATEGORY_ORDER[idx + 1];
      chapterCount = 0;
    }
  }
  const state = { ...g, chapter, chapterCount };
  const prev = currentEntry(g);
  const recent = recentTopicIds(g);

  let card: Card | null = null;
  let used = g.usedTopicIds;

  const isFirstForGraduate = countFor(g, graduateId) === 0;
  const prevWasSpecial = prev?.card.kind === "special";
  if (ctx.forceSpecial) {
    card = {
      kind: "special",
      special: ctx.forceSpecial === "random" ? pickSpecial(ctx.mood, rng) : ctx.forceSpecial,
    };
  } else if (
    !ctx.noSpecial &&
    !isFirstForGraduate &&
    !prevWasSpecial &&
    rng() < SPECIAL_RATE[ctx.mood]
  ) {
    card = { kind: "special", special: pickSpecial(ctx.mood, rng) };
  }

  if (!card) {
    let cat = resolveCategory(state, ctx.mood, rng);
    // 自動進行中にカテゴリーを使い切ったら、すぐにリセットせず他カテゴリーの未使用お題を使う。
    // （LAST MESSAGE はクライマックス用に温存。全て使い切ったときだけリセットされる）
    if (!g.chapterLocked && !hasUnused(ctx.topics, cat, used)) {
      const i = CATEGORY_ORDER.indexOf(chapter);
      const fallback = [
        ...CATEGORY_ORDER.slice(0, i).reverse(),
        ...CATEGORY_ORDER.slice(i + 1),
      ].filter((c) => c !== "last");
      cat = fallback.find((c) => hasUnused(ctx.topics, c, used)) ?? cat;
    }
    const picked =
      pickTopic(ctx.topics, cat, used, ctx.mood, rng, recent) ??
      pickTopic(ctx.topics, chapter, used, ctx.mood, rng, recent);
    if (!picked) return state;
    used = picked.used;
    card = {
      kind: "topic",
      topicId: picked.topic.id,
      category: picked.topic.category,
      text: picked.topic.text,
    };
  }

  const history = [...g.history.slice(0, g.cursor + 1), { graduateId, card }];
  return {
    ...state,
    screen: "topic",
    usedTopicIds: used,
    history,
    cursor: history.length - 1,
    chapterCount: chapterCount + 1,
  };
}

/** NEXT：先の履歴があればそこへ進み、なければ新しく引く */
export function next(g: GameState, ctx: DrawContext): GameState {
  if (g.cursor < g.history.length - 1) {
    const cursor = g.cursor + 1;
    return { ...g, cursor, graduateId: g.history[cursor].graduateId, screen: "topic" };
  }
  return draw(g, ctx);
}

/** 戻る：1枚前のカードへ。最初のカードなら「お題を引く」画面へ */
export function back(g: GameState): GameState {
  if (g.cursor > 0) {
    const cursor = g.cursor - 1;
    return { ...g, cursor, graduateId: g.history[cursor].graduateId };
  }
  return { ...g, cursor: -1, screen: "ready" };
}

/** スキップ：今のカードを別のお題に差し替える（スキップしたお題は使用済みのまま） */
export function skip(g: GameState, ctx: DrawContext): GameState {
  const cur = currentEntry(g);
  if (!cur) return draw(g, ctx);
  const rng = ctx.rng ?? Math.random;
  const cat = cur.card.kind === "topic" ? cur.card.category : resolveCategory(g, ctx.mood, rng);
  const picked = pickTopic(ctx.topics, cat, g.usedTopicIds, ctx.mood, rng, recentTopicIds(g));
  if (!picked) return g;
  const history = [...g.history.slice(0, g.cursor)];
  history.push({
    graduateId: cur.graduateId,
    card: { kind: "topic", topicId: picked.topic.id, category: cat, text: picked.topic.text },
  });
  return { ...g, history, cursor: history.length - 1, usedTopicIds: picked.used };
}

/** 仲間カテゴリー：「その人を指名する」→ 現役メンバーから卒業生への一言カード */
export function reply(g: GameState): GameState {
  const cur = currentEntry(g);
  if (!cur) return g;
  const history = [
    ...g.history.slice(0, g.cursor + 1),
    { graduateId: cur.graduateId, card: { kind: "reply" } as Card },
  ];
  return { ...g, history, cursor: history.length - 1 };
}

export function setChapter(g: GameState, chapter: Category | "auto"): GameState {
  if (chapter === "auto") return { ...g, chapterLocked: false };
  return { ...g, chapter, chapterCount: 0, chapterLocked: true };
}

/** LAST MESSAGE：次に話す卒業生（現在の卒業生を優先、終わっていれば未完了の先頭） */
export function nextLastGraduate(g: GameState, graduates: Graduate[]): string | null {
  const pending = graduates.filter((x) => !g.lastDone.includes(x.id));
  if (g.graduateId && pending.some((x) => x.id === g.graduateId)) return g.graduateId;
  return pending[0]?.id ?? null;
}

export function enterLast(g: GameState, graduates: Graduate[]): GameState {
  const graduateId = nextLastGraduate(g, graduates) ?? g.graduateId ?? graduates[0]?.id ?? null;
  return { ...g, screen: "last-intro", graduateId, lastCard: null, lastRevealed: false };
}

/** MESSAGE ボタン：最後のお題を引く（戻ってから再度押した場合は同じお題） */
export function revealLast(g: GameState, ctx: DrawContext): GameState {
  if (g.lastCard) return { ...g, screen: "last-question", lastRevealed: true };
  const rng = ctx.rng ?? Math.random;
  const picked = pickTopic(ctx.topics, "last", g.usedTopicIds, "normal", rng);
  const lastCard = picked
    ? { topicId: picked.topic.id, text: picked.topic.text }
    : { topicId: "", text: "最後に、仲間へ一言。" };
  return {
    ...g,
    screen: "last-question",
    lastCard,
    lastRevealed: true,
    usedTopicIds: picked ? picked.used : g.usedTopicIds,
  };
}

/** LAST MESSAGE の回答が終わった → 次の卒業生へ、または全員終わればフィナーレ */
export function finishLast(g: GameState, graduates: Graduate[], toFinale = false): GameState {
  const lastDone =
    g.graduateId && !g.lastDone.includes(g.graduateId) ? [...g.lastDone, g.graduateId] : g.lastDone;
  const after = { ...g, lastDone, lastCard: null, lastRevealed: false };
  const pending = graduates.find((x) => !lastDone.includes(x.id));
  if (toFinale || !pending) return { ...after, screen: "finale" };
  return { ...after, screen: "last-intro", graduateId: pending.id };
}
