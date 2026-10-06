"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from "react";
import * as E from "@/lib/engine";
import { STORAGE_KEYS, usePersistentState } from "@/lib/storage";
import { DEFAULT_TOPICS, TOPICS_VERSION } from "@/lib/topics";
import { upgradeTopics } from "@/lib/topicUpgrade";
import type {
  Category,
  GameState,
  Graduate,
  Member,
  Letter,
  ReactionCounts,
  Mood,
  Screen,
  Settings,
  SpecialKind,
  Topic,
} from "@/lib/types";

export const MAX_GRADUATES = 10;

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

const isArray = <T,>(v: unknown): v is T[] => Array.isArray(v);
const isGame = (v: unknown): v is GameState =>
  !!v && typeof v === "object" && Array.isArray((v as GameState).history) && "screen" in v;
const isSettings = (v: unknown): v is Settings =>
  !!v && typeof v === "object" && "venueMode" in v && "mood" in v;

export const displayName = (g: Graduate | undefined | null) =>
  g ? g.nickname.trim() || g.name.trim() : "";

function useStoreValue() {
  const [graduates, setGraduates, gLoaded] = usePersistentState<Graduate[]>(
    STORAGE_KEYS.graduates,
    () => [],
    isArray<Graduate>,
  );
  const [topics, setTopics, tLoaded] = usePersistentState<Topic[]>(
    STORAGE_KEYS.topics,
    () => DEFAULT_TOPICS,
    isArray<Topic>,
  );
  const [settings, setSettings, sLoaded] = usePersistentState<Settings>(
    STORAGE_KEYS.settings,
    () => ({ venueMode: false, mood: "normal" }),
    isSettings,
  );
  const [game, setGame, gmLoaded] = usePersistentState<GameState>(
    STORAGE_KEYS.game,
    E.initialGame,
    isGame,
  );
  const [members, setMembers, mLoaded] = usePersistentState<Member[]>(
    STORAGE_KEYS.members,
    () => [],
    isArray<Member>,
  );
  const [letters, setLetters, lLoaded] = usePersistentState<Letter[]>(
    STORAGE_KEYS.letters,
    () => [],
    isArray<Letter>,
  );
  const loaded = gLoaded && tLoaded && sLoaded && gmLoaded && mLoaded && lLoaded;

  // 標準お題が新しくなっていたら入れ替える。自分で追加・編集したお題はそのまま残す
  useEffect(() => {
    if (!loaded || settings.topicsVersion === TOPICS_VERSION) return;
    setTopics((list) => upgradeTopics(list));
    setSettings((s) => ({ ...s, topicsVersion: TOPICS_VERSION }));
  }, [loaded, settings.topicsVersion, setTopics, setSettings]);

  const ctx = useCallback(
    (extra?: Partial<E.DrawContext>): E.DrawContext => ({
      topics,
      graduates,
      mood: settings.mood,
      ...extra,
    }),
    [topics, graduates, settings.mood],
  );

  const graduate = graduates.find((g) => g.id === game.graduateId) ?? null;
  /** QR から参加した人数（エピソード判定の目標に使う） */
  const joinedCount = members.filter((m) => m.joined).length;

  const actions = useMemo(
    () => ({
      goTo: (screen: Screen) =>
        setGame((g) =>
          screen === "setup" && g.screen !== "setup"
            ? { ...g, screen, returnTo: g.screen, roulette: null }
            : { ...g, screen, roulette: null },
        ),
      closeSetup: () =>
        setGame((g) => {
          let screen: Screen = g.returnTo ?? "top";
          if (screen === "ready" && !graduates.some((x) => x.id === g.graduateId)) screen = "select";
          return { ...g, screen, returnTo: undefined };
        }),

      /** START：新しいゲームを始める */
      start: () => {
        const base = E.initialGame();
        if (graduates.length === 0) return setGame({ ...base, screen: "setup" });
        if (graduates.length === 1)
          return setGame({ ...base, screen: "ready", graduateId: graduates[0].id });
        setGame({ ...base, screen: "select" });
      },
      resume: () =>
        setGame((g) => ({
          ...g,
          screen: g.cursor >= 0 ? "topic" : g.graduateId ? "ready" : "select",
        })),
      selectGraduate: (id: string) =>
        setGame((g) => ({ ...g, graduateId: id, screen: "ready", roulette: null })),
      /** 卒業生ルーレット：まだ話していない人ほど当たりやすい */
      startRoulette: () =>
        setGame((g) => {
          if (graduates.length === 0) return g;
          const counts = graduates.map((x) => E.countFor(g, x.id));
          const min = Math.min(...counts);
          let pool = graduates.filter((_, i) => counts[i] === min);
          if (pool.length > 1) pool = pool.filter((x) => x.id !== g.graduateId);
          const winner = pool[Math.floor(Math.random() * pool.length)];
          return { ...g, screen: "select", roulette: { id: uid(), winnerId: winner.id } };
        }),
      draw: () => setGame((g) => E.draw(g, ctx())),
      next: () =>
        setGame((g) => {
          // エピソード判定：リアクションが目標に届かなければ、進む前に「一杯！」を出す
          if (!g.penalty && settings.drinkRule !== false && settings.liveOn) {
            const out = E.episodeCheck(g, joinedCount, graduates, uid());
            if (out) return { ...out, memberPick: null, judge: null, vote: null };
          }
          return E.next(
            { ...g, memberPick: null, judge: null, vote: null, penalty: null },
            { ...ctx(), rotate: settings.rotate !== false },
          );
        }),
      chooseTopic: (topicId: string) =>
        setGame((g) =>
          E.chooseTopic(
            { ...g, memberPick: null, judge: null, vote: null, penalty: null },
            topicId,
            { ...ctx(), rotate: settings.rotate !== false },
          ),
        ),
      back: () =>
        setGame((g) =>
          g.penalty
            ? { ...g, penalty: null }
            : E.back({ ...g, memberPick: null, judge: null, vote: null, penalty: null }),
        ),
      skip: () => setGame((g) => E.skip({ ...g, memberPick: null, judge: null, vote: null, penalty: null }, ctx())),

      // ── 現役メンバー ──
      /** 現役ルーレット：直前に当たった人は外して、ランダムに1人指名 */
      pickMember: () =>
        setGame((g) => {
          if (members.length === 0) return g;
          let pool = members.filter((m) => m.id !== g.memberPick?.memberId);
          if (pool.length === 0) pool = members;
          const win = pool[Math.floor(Math.random() * pool.length)];
          // ルーレットに流す名前（多すぎると読めないので最大16人。当選者は必ず含める）
          const others = members.filter((m) => m.id !== win.id).sort(() => Math.random() - 0.5).slice(0, 15);
          const names = [...others.map((m) => m.name), win.name].sort(() => Math.random() - 0.5);
          return { ...g, memberPick: { id: uid(), memberId: win.id, name: win.name, names } };
        }),
      closeMemberPick: () => setGame((g) => ({ ...g, memberPick: null })),
      addMember: (name: string) =>
        setMembers((list) =>
          !name.trim() || list.length >= 80 ? list : [...list, { id: uid(), name: name.trim().slice(0, 16) }],
        ),
      removeMember: (id: string) => setMembers((list) => list.filter((m) => m.id !== id)),
      /** QR から参加した人を登録（同じ端末なら名前を更新） */
      memberJoined: (id: string, name: string) =>
        setMembers((list) => {
          const n = name.trim().slice(0, 16);
          if (!n || !/^[a-z0-9]{4,24}$/.test(id)) return list;
          const i = list.findIndex((m) => m.id === id);
          if (i >= 0) return list[i].name === n ? list : list.map((m, k) => (k === i ? { ...m, name: n } : m));
          return list.length >= 80 ? list : [...list, { id, name: n, joined: true }];
        }),
      reply: () => setGame((g) => E.reply(g)),
      special: (kind: SpecialKind | "random") =>
        setGame((g) =>
          g.graduateId ? E.draw({ ...g, screen: "topic" }, ctx({ forceSpecial: kind })) : g,
        ),
      setChapter: (c: Category | "auto") => setGame((g) => E.setChapter(g, c)),
      /** カテゴリー変更：固定してすぐにそのカテゴリーから1枚引く */
      changeCategory: (c: Category | "auto") =>
        setGame((g) => {
          const set = E.setChapter(g, c);
          const inGame = g.screen === "topic" || g.screen === "ready";
          return inGame && g.graduateId && c !== "auto"
            ? E.draw(set, ctx({ noSpecial: true }))
            : set;
        }),
      enterLast: () => setGame((g) => E.enterLast(g, graduates)),
      chooseLastGraduate: (id: string) =>
        setGame((g) => ({ ...g, graduateId: id, lastCard: null, lastRevealed: false })),
      revealLast: () => setGame((g) => E.revealLast(g, ctx())),
      finishLast: (toFinale = false) => setGame((g) => E.finishLast(g, graduates, toFinale)),
      // ── 優勝ポイント ──
      /** 参加者のリアクションを、いま話している卒業生のポイントに加える */
      addScores: (r: ReactionCounts) =>
        setGame((g) => E.tallyCard(E.countJudge(E.addScores(g, r), r, Date.now()), r)),
      // ── ホント？盛ってる？ ──
      startVote: () => setGame((g) => E.startVote(g, graduates, Date.now(), uid())),
      castVote: (voteId: string, voter: string, choice: "real" | "fake") =>
        setGame((g) => E.castVote(g, voteId, voter, choice, Date.now())),
      finishVote: () => setGame((g) => E.finishVote(g)),
      closeVote: () => setGame((g) => ({ ...g, vote: null })),
      // ── 寄せ書き ──
      /** 届いた寄せ書きを保存（あて先は卒業生の呼び名で照合。同じものは1回だけ） */
      addLetter: (l: { id: string; to: string; from: string; text: string }) =>
        setLetters((list) => {
          const grad = graduates.find((x) => displayName(x) === l.to);
          if (!grad || list.some((x) => x.id === l.id) || list.length >= 300) return list;
          return [...list, { id: l.id, to: grad.id, from: l.from, text: l.text }];
        }),
      removeLetter: (id: string) => setLetters((list) => list.filter((x) => x.id !== id)),
      openLetters: (to: string) =>
        setGame((g) => ({ ...g, memberPick: null, letters: { id: uid(), to, page: 0 } })),
      letterPage: (page: number) =>
        setGame((g) => (g.letters ? { ...g, letters: { ...g.letters, page } } : g)),
      closeLetters: () => setGame((g) => ({ ...g, letters: null })),
      toggleDrinkRule: () => setSettings((s) => ({ ...s, drinkRule: s.drinkRule === false })),
      // ── 判定タイム ──
      /** 目標は QR で参加した人数（いなければ登録メンバー数）から決める */
      startJudge: () =>
        setGame((g) =>
          E.startJudge(g, members.filter((m) => m.joined).length || members.length, Date.now(), uid()),
        ),
      finishJudge: () => setGame((g) => E.finishJudge(g)),
      closeJudge: () => setGame((g) => ({ ...g, judge: null })),
      enterAward: () => setGame((g) => ({ ...g, screen: "award", awardRevealed: false })),
      revealAward: () => setGame((g) => ({ ...g, awardRevealed: true })),
      restart: () => setGame({ ...E.initialGame(), screen: "top" }),

      // ── 卒業生 ──
      addGraduate: (name: string, nickname: string) =>
        setGraduates((list) =>
          list.length >= MAX_GRADUATES
            ? list
            : [...list, { id: uid(), name: name.trim(), nickname: nickname.trim() }],
        ),
      updateGraduate: (id: string, patch: Partial<Omit<Graduate, "id">>) =>
        setGraduates((list) => list.map((g) => (g.id === id ? { ...g, ...patch } : g))),
      removeGraduate: (id: string) => {
        setGraduates((list) => list.filter((g) => g.id !== id));
        setGame((g) => (g.graduateId === id ? { ...g, graduateId: null } : g));
      },
      moveGraduate: (id: string, dir: -1 | 1) =>
        setGraduates((list) => {
          const i = list.findIndex((g) => g.id === id);
          const j = i + dir;
          if (i < 0 || j < 0 || j >= list.length) return list;
          const copy = [...list];
          [copy[i], copy[j]] = [copy[j], copy[i]];
          return copy;
        }),

      // ── お題 ──
      addTopic: (category: Category, text: string) =>
        setTopics((list) => [
          ...list,
          { id: `custom-${uid()}`, category, text: text.trim(), tags: [], builtIn: false },
        ]),
      updateTopic: (id: string, text: string) =>
        setTopics((list) =>
          // 標準お題を書き換えたら「自分のお題」にする（標準お題の入れ替えでも消えない）
          list.map((t) =>
            t.id === id ? { ...t, text: text.trim(), ...(t.builtIn ? { builtIn: false, edited: true } : {}) } : t,
          ),
        ),
      removeTopic: (id: string) => setTopics((list) => list.filter((t) => t.id !== id)),
      restoreDefaultTopics: () =>
        setTopics((list) => {
          // 消した標準お題を元に戻す（自分で追加・編集したお題は残す）
          return upgradeTopics(list);
        }),

      // ── 設定 ──
      setMood: (mood: Mood) => setSettings((s) => ({ ...s, mood })),
      toggleRotate: () => setSettings((s) => ({ ...s, rotate: s.rotate === false })),
      toggleShuffle: () => setSettings((s) => ({ ...s, shuffleFx: s.shuffleFx === false })),
      toggleVenue: () => setSettings((s) => ({ ...s, venueMode: !s.venueMode })),
      setLiveOn: (on: boolean) => setSettings((s) => ({ ...s, liveOn: on })),
    }),
    [ctx, graduates, members, setLetters, joinedCount, settings.rotate, settings.drinkRule, settings.liveOn, setMembers, setGame, setGraduates, setTopics, setSettings],
  );

  return { loaded, graduates, topics, settings, game, graduate, members, letters, actions };
}

type Store = ReturnType<typeof useStoreValue>;
const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const value = useStoreValue();
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const s = useContext(StoreContext);
  if (!s) throw new Error("useStore must be used inside StoreProvider");
  return s;
}
