import type { Category, SpecialKind, Topic, TopicTag } from "./types";

export const CATEGORY_ORDER: Category[] = ["laugh", "memory", "friends", "last"];

export const CATEGORY_META: Record<
  Category,
  { label: string; en: string; note: string }
> = {
  laugh: { label: "笑い", en: "LAUGHTER", note: "序盤：場をあたためる" },
  memory: { label: "思い出", en: "MEMORIES", note: "中盤：懐かしむ" },
  friends: { label: "仲間", en: "COMRADES", note: "終盤：仲間を振り返る" },
  last: { label: "LAST MESSAGE", en: "LAST MESSAGE", note: "最後：感謝を伝える" },
};

export const SPECIAL_META: Record<
  SpecialKind,
  { label: string; en: string; text: string; sub: string }
> = {
  nominate: {
    label: "指名",
    en: "NOMINATE",
    text: "この人に一言。",
    sub: "会場から現役メンバーを1人指名してください",
  },
  reverse: {
    label: "逆質問",
    en: "REVERSE",
    text: "今度はあなたから質問してください。",
    sub: "現役メンバーを1人選んで、卒業生から質問",
  },
  everyone: {
    label: "全員",
    en: "EVERYONE",
    text: "この人との一番の思い出を、会場から一言。",
    sub: "まずは会場全員で拍手を。司会者が1人を指名します",
  },
  photo: {
    label: "写真",
    en: "PHOTO",
    text: "思い出の写真を1枚見せてください。",
    sub: "スマートフォンの写真をその場で見せてください",
  },
};

type Seed = [string, TopicTag[]?];

const SEEDS: Record<Category, Seed[]> = {
  laugh: [
    ["JCで一番笑った出来事は？", ["hype"]],
    ["JCで一番やらかしたことは？", ["hype"]],
    ["今だから言える失敗談は？", ["hype"]],
    ["一番酔っ払っていたメンバーは？", ["hype"]],
    ["一番クセが強かったメンバーは？", ["hype"]],
    ["一番無茶だった事業は？"],
    ["もう一度やれと言われたら絶対嫌な事業は？", ["hype"]],
    ["JCに入って一番驚いたことは？"],
    ["実は当時、こう思っていました。", ["hype"]],
    ["一番笑った懇親会は？", ["hype"]],
    ["一番印象に残っている二次会は？", ["hype"]],
    ["一番長かった会議の思い出は？"],
    ["正直、一番キツかった先輩は？", ["hype"]],
  ],
  memory: [
    ["一番印象に残っている事業は？"],
    ["JC人生で一番嬉しかった瞬間は？", ["calm"]],
    ["一番しんどかった瞬間は？"],
    ["一番忘れられない例会は？"],
    ["入会した頃の自分に、一言。", ["calm"]],
    ["JCで一番成長できたと思うことは？", ["calm"]],
    ["一番心に残っている言葉は？", ["calm"]],
    ["JCに入っていなかったら、何をしていた？"],
    ["一番思い出深い一年は？", ["calm"]],
    ["もう一度戻れるなら、何年度？"],
    ["入会を決めた、本当の理由は？"],
  ],
  friends: [
    ["一番お世話になった人は？", ["calm"]],
    ["一番相談した人は？", ["calm"]],
    ["一番刺激を受けた人は？"],
    ["一緒に事業をして楽しかった人は？"],
    ["この人には、今だから言いたい。", ["hype"]],
    ["卒業しても飲みに行きたい人は？", ["hype"]],
    ["次の世代を任せたい人は？"],
    ["一番成長したと思う現役メンバーは？"],
    ["これから期待しているメンバーは？"],
    ["今日ここにいる誰か一人に、一言。", ["hype"]],
    ["実は一番頼りにしていた人は？", ["calm"]],
  ],
  last: [
    ["JCに入って、良かったですか？"],
    ["JCとは、あなたにとって何でしたか？"],
    ["一番感謝していることは？"],
    ["現役メンバーに伝えたいことは？"],
    ["次の世代に残したい言葉は？"],
    ["卒業後も大切にしたいものは？"],
    ["10年後、今日をどう思い出したい？"],
    ["JC生活を一言で表すなら？"],
    ["最後に、仲間へ一言。"],
    ["卒業する今の気持ちは？"],
  ],
};

/** 標準お題（IDは固定。保存データとの照合に使う） */
export const DEFAULT_TOPICS: Topic[] = CATEGORY_ORDER.flatMap((category) =>
  SEEDS[category].map(([text, tags], i) => ({
    id: `std-${category}-${String(i + 1).padStart(2, "0")}`,
    category,
    text,
    tags: tags ?? [],
    builtIn: true,
  })),
);

/** クライマックスで必ず最初に出す「最後のお題」 */
export const FINALE_PROMPT = "最後に、仲間へ伝えたいこと。";
