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
    sub: "卒業生が会場から1人を名指し。遠慮はいりません",
  },
  reverse: {
    label: "逆質問",
    en: "REVERSE",
    text: "今度はあなたから質問してください。",
    sub: "卒業生から現役メンバーへ。聞かれた人はパス禁止",
  },
  everyone: {
    label: "全員",
    en: "EVERYONE",
    text: "この人との一番の思い出を、会場から一言。",
    sub: "まずは全員で拍手。司会者が1人を指名します",
  },
  photo: {
    label: "写真",
    en: "PHOTO",
    text: "思い出の写真を1枚見せてください。",
    sub: "スマホのアルバムから1枚。見せられない写真は除きます",
  },
};

type Seed = [string, TopicTag[]?];

const SEEDS: Record<Category, Seed[]> = {
  // 序盤：内輪ネタと暴露で一気に場をあたためる
  laugh: [
    ["JCを理由に家族にした、一番苦しい言い訳は？", ["hype"]],
    ["議案書、正直どれくらい読まずに承認してきましたか？", ["hype"]],
    ["懇親会で一番やらかしたこと。今夜で時効です。", ["hype"]],
    ["一番酒癖が悪いのは誰？名前でどうぞ。", ["hype"]],
    ["正直、一番意味がわからなかった事業は？", ["hype"]],
    ["理事会の最中、本当は何を考えていましたか？", ["hype"]],
    ["先輩に言われて「は？」と思った一言は？", ["hype"]],
    ["例会中に寝たことはありますか？何回？", ["hype"]],
    ["二次会、三次会…最長で何時に帰りましたか？", ["hype"]],
    ["京都会議や全国大会、本当の思い出は夜の部ですか？", ["hype"]],
    ["この中で、一番上司にしたくない人は？理由もどうぞ。", ["hype"]],
    ["「もう辞めよう」と本気で思った回数と、その理由は？", ["hype"]],
    ["家族から、JCは何の団体だと思われていますか？"],
    ["ノリで引き受けて、一番後悔した役は？"],
    ["JCのLINE、一番既読スルーしている相手は？", ["hype"]],
  ],
  // 中盤：笑いを残しつつ、本音と記憶に踏み込む
  memory: [
    ["事業当日、裏で起きていた一番の大事件は？", ["hype"]],
    ["一番揉めた会議。結局、勝ったのはどっち？", ["hype"]],
    ["入会を決めた本当の理由は？建前は禁止です。", ["hype"]],
    ["JCで一番お金がかかった思い出は？", ["hype"]],
    ["一番しんどかった年。何がそんなにキツかった？"],
    ["JCで本気で泣いた瞬間は？", ["calm"]],
    ["入会した日の自分に、一言どうぞ。", ["calm"]],
    ["一番心に刺さった、誰かの一言は？", ["calm"]],
    ["胸を張って「成功だった」と言える事業は？", ["calm"]],
    ["JCで身についた、仕事で一番効いているスキルは？"],
    ["JCに入っていなかったら、今ごろ何をしていた？"],
    ["もう一度だけ戻れるなら、何年度の何月？"],
    ["正直、一番悔いが残っていることは？", ["calm"]],
  ],
  // 終盤：名指しで仲間を振り返る（回答後「その人を指名する」）
  friends: [
    ["一番迷惑をかけた人に、今ここで謝ってください。", ["hype"]],
    ["実はライバルだと思っていた人は？", ["hype"]],
    ["次の理事長をやってほしい人は？", ["hype"]],
    ["一番放っておけない後輩は？", ["hype"]],
    ["この人には、今だから言えることがある。", ["hype"]],
    ["卒業しても、絶対に飲みに誘いたい人は？", ["hype"]],
    ["一番お世話になった人は？", ["calm"]],
    ["本当は一番尊敬していた人は？本人の前でどうぞ。", ["calm"]],
    ["夜中に電話しても、出てくれそうな人は？", ["calm"]],
    ["自分の後を任せたい人は？", ["calm"]],
    ["一番化けた（成長した）現役メンバーは？"],
    ["この中で、一番JCらしい人は？"],
  ],
  // 最後：まっすぐに感謝を
  last: [
    ["JCに入って、本当に良かったですか？"],
    ["JCとは、あなたにとって何でしたか？一言で。"],
    ["一番「ありがとう」を言いたい人に、今どうぞ。"],
    ["現役メンバーに、これだけは伝えたい。"],
    ["次の世代に残したい言葉は？"],
    ["卒業しても、ずっと大切にしたいものは？"],
    ["10年後、今日のことをどう思い出したい？"],
    ["支えてくれた家族に、一言。"],
    ["最後に、仲間へ一言。"],
    ["卒業する、今の気持ちは？"],
  ],
};

/** 標準お題を差し替えたら上げる。保存済みの標準お題を新しいものに入れ替える */
export const TOPICS_VERSION = 2;

/** 標準お題（IDは固定。保存データとの照合に使う） */
export const DEFAULT_TOPICS: Topic[] = CATEGORY_ORDER.flatMap((category) =>
  SEEDS[category].map(([text, tags], i) => ({
    id: `std${TOPICS_VERSION}-${category}-${String(i + 1).padStart(2, "0")}`,
    category,
    text,
    tags: tags ?? [],
    builtIn: true,
  })),
);

/** クライマックスで必ず最初に出す「最後のお題」 */
export const FINALE_PROMPT = "最後に、仲間へ伝えたいこと。";
