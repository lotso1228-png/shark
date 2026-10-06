/** laugh〜last は卒業生へのお題（この順に進行）。crowd は会場の現役メンバーが答えるお題 */
export type Category = "laugh" | "memory" | "friends" | "last" | "crowd";

/** hype: 盛り上がりモードで優先 / calm: しっとりモードで優先 / judge: 回答のあと「判定タイム」をすすめる（モノマネなど） */
export type TopicTag = "hype" | "calm" | "judge";

export interface Topic {
  id: string;
  category: Category;
  text: string;
  tags: TopicTag[];
  builtIn: boolean;
  /** 標準お題を自分で書き換えたもの（標準お題の入れ替えでも消さない） */
  edited?: boolean;
}

export interface Graduate {
  id: string;
  name: string;
  nickname: string;
}

/** 寄せ書き：参加者から卒業生への一言 */
export interface Letter {
  id: string;
  /** あて先の卒業生 ID */
  to: string;
  from: string;
  text: string;
}

/** 現役メンバー（司会者が登録、または参加者がQRから名前を入れて参加） */
export interface Member {
  id: string;
  name: string;
  joined?: boolean;
}

export type SpecialKind = "nominate" | "reverse" | "everyone" | "photo" | "toast";

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
  | "award"
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
  /** いま表示中のカードに届いたリアクション数（エピソード判定用） */
  tally?: { key: string; count: number };
  /** 投票・判定タイムを済ませたカード（同じカードで二重に飲ませない） */
  judgedKey?: string;
  /** エピソード判定でアウトになった卒業生（NEXT で閉じて次へ） */
  penalty?: { id: string; name: string; count: number; target: number } | null;
  /** 寄せ書きを流している卒業生とページ */
  letters?: { id: string; to: string; page: number } | null;
  /** 「ホント？盛ってる？」投票 */
  vote?: Vote | null;
  /** 判定タイム：一定時間のリアクション数が目標に届かなければ一杯 */
  judge?: Judge | null;
  /** 優勝ポイント：卒業生ごとに受け取ったリアクションの数 */
  scores?: Record<string, ReactionCounts>;
  /** 優勝発表で結果を開いたか */
  awardRevealed?: boolean;
  /** 現役ルーレットで指名中のメンバー */
  memberPick?: { id: string; memberId: string; name: string; names: string[] } | null;
  /** 設定画面を閉じたときに戻る画面 */
  returnTo?: Screen;
}

export interface Judge {
  id: string;
  /** 受付の終了時刻（司会者の端末の時計） */
  endsAt: number;
  /** 受付時間（秒） */
  seconds: number;
  target: number;
  count: number;
  result?: "safe" | "out";
}

export interface Vote {
  id: string;
  /** 投票の対象の卒業生（呼び名） */
  name: string;
  endsAt: number;
  seconds: number;
  real: number;
  fake: number;
  voters: string[];
  result?: "real" | "fake";
}

export type ReactionCounts = Partial<Record<"clap" | "laugh" | "cry" | "fire", number>>;

export interface Settings {
  venueMode: boolean;
  mood: Mood;
  /** 参加者のスマホへの同時表示（ログイン不要版）。司会者がオンにしたときだけ配信する */
  liveOn?: boolean;
  /** 保存済みの標準お題がどの版か（新しい版が出たら自動で入れ替える） */
  topicsVersion?: number;
  /** お題を引くときのシャッフル演出（既定でオン） */
  shuffleFx?: boolean;
  /** 1問ごとに話す卒業生を交代する（既定でオン） */
  rotate?: boolean;
  /** エピソード判定：卒業生の話へのリアクションが少なければ一杯（既定でオン） */
  drinkRule?: boolean;
}
