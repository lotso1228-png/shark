export type Category = "laugh" | "memory" | "friends" | "last";

/** hype: 盛り上がりモードで優先 / calm: しっとりモードで優先 */
export type TopicTag = "hype" | "calm";

export interface Topic {
  id: string;
  category: Category;
  text: string;
  tags: TopicTag[];
  builtIn: boolean;
}

export interface Graduate {
  id: string;
  name: string;
  nickname: string;
}

export type SpecialKind = "nominate" | "reverse" | "everyone" | "photo";

export type Mood = "normal" | "hype" | "calm";

/** 画面に表示される1枚のカード */
export type Card =
  | { kind: "topic"; topicId: string; category: Category; text: string }
  | { kind: "special"; special: SpecialKind }
  /** 仲間カテゴリーで「その人を指名する」を押したときの返礼カード */
  | { kind: "reply" };

export interface HistoryEntry {
  graduateId: string;
  card: Card;
}

export type Screen =
  | "top"
  | "select"
  | "ready"
  | "topic"
  | "last-intro"
  | "last-question"
  | "finale"
  | "setup";

export interface GameState {
  screen: Screen;
  graduateId: string | null;
  /** 流れ（笑い→思い出→仲間→LAST）の現在地 */
  chapter: Category;
  /** 現在の章で出したお題数（自動で次の章へ進む判定に使う） */
  chapterCount: number;
  /** true のとき司会者がカテゴリーを固定している */
  chapterLocked: boolean;
  usedTopicIds: string[];
  history: HistoryEntry[];
  /** history 上の現在位置（戻る/進む用） */
  cursor: number;
  /** LAST MESSAGE を終えた卒業生 */
  lastDone: string[];
  /** LAST MESSAGE で表示中のお題 */
  lastCard: { topicId: string; text: string } | null;
  lastRevealed: boolean;
  /** 卒業生ルーレットの実行中（回り終わったら選ばれた人の画面へ進む） */
  roulette?: { id: string; winnerId: string } | null;
  /** 設定画面を閉じたときに戻る画面 */
  returnTo?: Screen;
}

export interface Settings {
  venueMode: boolean;
  mood: Mood;
  /** 参加者のスマホへの同時表示（ログイン不要版）。司会者がオンにしたときだけ配信する */
  liveOn?: boolean;
  /** 保存済みの標準お題がどの版か（新しい版が出たら自動で入れ替える） */
  topicsVersion?: number;
  /** お題を引くときのシャッフル演出（既定でオン） */
  shuffleFx?: boolean;
}
