"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, type ReactNode } from "react";
import * as E from "@/lib/engine";
import { STORAGE_KEYS, usePersistentState } from "@/lib/storage";
import { DEFAULT_TOPICS, TOPICS_VERSION } from "@/lib/topics";
import type {
  Category,
  GameState,
  Graduate,
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
  const loaded = gLoaded && tLoaded && sLoaded && gmLoaded;

  // 標準お題が新しくなっていたら入れ替える（自分で追加したお題は残す）
  useEffect(() => {
    if (!loaded || settings.topicsVersion === TOPICS_VERSION) return;
    setTopics((list) => [...DEFAULT_TOPICS, ...list.filter((t) => !t.builtIn)]);
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

  const actions = useMemo(
    () => ({
      goTo: (screen: Screen) =>
        setGame((g) =>
          screen === "setup" && g.screen !== "setup"
            ? { ...g, screen, returnTo: g.screen }
            : { ...g, screen },
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
        setGame((g) => ({ ...g, graduateId: id, screen: "ready" })),
      draw: () => setGame((g) => E.draw(g, ctx())),
      next: () => setGame((g) => E.next(g, ctx())),
      back: () => setGame((g) => E.back(g)),
      skip: () => setGame((g) => E.skip(g, ctx())),
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
        setTopics((list) => list.map((t) => (t.id === id ? { ...t, text: text.trim() } : t))),
      removeTopic: (id: string) => setTopics((list) => list.filter((t) => t.id !== id)),
      restoreDefaultTopics: () =>
        setTopics((list) => {
          // 標準お題を初期状態に戻し、カスタムお題は残す
          const custom = list.filter((t) => !t.builtIn);
          return [...DEFAULT_TOPICS, ...custom];
        }),

      // ── 設定 ──
      setMood: (mood: Mood) => setSettings((s) => ({ ...s, mood })),
      toggleVenue: () => setSettings((s) => ({ ...s, venueMode: !s.venueMode })),
      setLiveOn: (on: boolean) => setSettings((s) => ({ ...s, liveOn: on })),
    }),
    [ctx, graduates, setGame, setGraduates, setTopics, setSettings],
  );

  return { loaded, graduates, topics, settings, game, graduate, actions };
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
