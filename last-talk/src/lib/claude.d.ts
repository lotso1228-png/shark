/** 公開ページ（claude.ai のアーティファクト）で使う最小限の型。単体ファイルや Next.js 版では存在しない。 */
export {};

type Unsubscribe = () => void;

export interface LiveDocSnapshot {
  exists: boolean;
  data(): Record<string, unknown> | undefined;
}

export interface LiveDocRef {
  get(): Promise<LiveDocSnapshot>;
  set(data: Record<string, unknown>): Promise<void>;
  onSnapshot(next: (s: LiveDocSnapshot) => void, error?: (e: { code: string }) => void): Unsubscribe;
}

export interface LiveDb {
  doc(path: string): LiveDocRef;
}

export interface LiveUser {
  isOwner(): Promise<boolean>;
}

declare global {
  interface Window {
    claude?: { use(name: "db"): Promise<LiveDb | null>; use(name: "user"): Promise<LiveUser | null> };
  }
}
