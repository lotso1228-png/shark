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
  // 序盤：暴露・名指し・本音で、一気に場をあたためる
  laugh: [
    ["正直、JCにいくら使った？元は取れた？", ["hype"]],
    ["家族に一番怒られた、JCの夜は？", ["hype"]],
    ["議案書をほぼ読まずに「異議なし」と言った回数は？", ["hype"]],
    ["理事会で寝落ちしたこと、正直何回ある？", ["hype"]],
    ["「JCの用事」と言って、実は遊んでいた日は？", ["hype"]],
    ["三次会から先の記憶がない夜、何回ありますか？", ["hype"]],
    ["この中で一番「仕事してるフリ」が上手い人は？", ["hype"]],
    ["一番話が長い先輩は？本人の前でどうぞ。", ["hype"]],
    ["この中で、絶対に財布を預けたくない人は？", ["hype"]],
    ["一番酒癖が悪いのは誰？名前でどうぞ。", ["hype"]],
    ["委員長をやって、一番キレそうになった瞬間は？", ["hype"]],
    ["正直、一番いらなかった会議は？", ["hype"]],
    ["京都会議や全国大会、一番の“やらかし”を暴露してください。", ["hype"]],
    ["JCに入って、一番キャラが変わった人は？", ["hype"]],
    ["今だから言える、先輩への本音の文句を一つ。", ["hype"]],
    ["卒業したら二度とやらないと決めていることは？", ["hype"]],
  ],
  // 中盤：笑いを残しつつ、本音と記憶に踏み込む
  memory: [
    ["一番“地獄”だった事業。何が起きた？", ["hype"]],
    ["事業当日、裏で起きていた一番の大事件は？", ["hype"]],
    ["一番揉めた会議。今だから言える本当の原因は？", ["hype"]],
    ["入会の本当の理由は？建前は禁止です。", ["hype"]],
    ["自分の年度に点数をつけるなら何点？理由も。", ["hype"]],
    ["JCを辞めかけた夜、何があった？", ["hype"]],
    ["JCで本気で泣いた日。誰の前で？", ["calm"]],
    ["入会した日の自分に、一言どうぞ。", ["calm"]],
    ["一番心に刺さった、誰かの一言は？", ["calm"]],
    ["胸を張れる事業を、一つだけ選ぶなら？", ["calm"]],
    ["JCがなかったら、今の仕事はどうなっていた？"],
    ["もう一度だけ戻れるなら、何年度の何月？"],
    ["正直、一番悔いが残っていることは？", ["calm"]],
  ],
  // 終盤：名指しで仲間を振り返る（回答後「その人を指名する」）
  friends: [
    ["一番迷惑をかけた人に、今ここで謝ってください。", ["hype"]],
    ["実はライバルだと思っていた人は？本人の前でどうぞ。", ["hype"]],
    ["次の理事長は誰？今ここで名前を出してください。", ["hype"]],
    ["正直、最初は苦手だった人は？今はどう？", ["hype"]],
    ["一番放っておけない後輩は？", ["hype"]],
    ["この人には、今だから言いたいことがある。", ["hype"]],
    ["卒業しても、絶対に飲みに誘いたい人は？", ["hype"]],
    ["一番“化けた”現役メンバーは？"],
    ["この中で、一番JCらしい人は？"],
    ["本当は一番尊敬していた人は？本人の前でどうぞ。", ["calm"]],
    ["夜中に電話しても、出てくれそうな人は？", ["calm"]],
    ["自分の後を任せたい人は？", ["calm"]],
    ["一番お世話になった人に、今ここで一言。", ["calm"]],
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
export const TOPICS_VERSION = 3;

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
