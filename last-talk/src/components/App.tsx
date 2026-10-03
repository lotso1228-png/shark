"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { ConfirmProvider, useConfirm } from "./Confirm";
import { HostMenu } from "./HostMenu";
import { StoreProvider, useStore } from "./StoreProvider";
import { FinaleScreen } from "./screens/FinaleScreen";
import { LastIntroScreen, LastQuestionScreen } from "./screens/LastScreens";
import { ReadyScreen } from "./screens/ReadyScreen";
import { SelectScreen } from "./screens/SelectScreen";
import { SetupScreen } from "./screens/SetupScreen";
import { TopScreen } from "./screens/TopScreen";
import { TopicScreen } from "./screens/TopicScreen";
import { screenFade } from "./ui";
import { useFullscreen } from "./useFullscreen";
import { useWakeLock } from "./useWakeLock";
import { AudienceView } from "./live/AudienceView";
import { LiveBroadcaster, useLiveRole } from "./live/LiveProvider";

export function App() {
  const { role, db } = useLiveRole();
  if (role === "pending") return <main className="stage h-dvh w-full" />;
  if (role === "audience") return <AudienceView db={db} />;
  return (
    <StoreProvider>
      <LiveBroadcaster db={role === "host" ? db : null}>
        <ConfirmProvider>
          <Stage />
        </ConfirmProvider>
      </LiveBroadcaster>
    </StoreProvider>
  );
}

const DARK_SCREENS = new Set(["last-intro", "last-question", "finale"]);

function Stage() {
  const { loaded, game, settings, graduates, actions } = useStore();
  const confirm = useConfirm();
  const [menuOpen, setMenuOpen] = useState(false);
  const fullscreen = useFullscreen();
  useWakeLock();
  const screen = game.screen;

  const backFromLast = useCallback(() => {
    actions.goTo(game.cursor >= 0 ? "topic" : game.graduateId ? "ready" : "select");
  }, [actions, game.cursor, game.graduateId]);

  /** キーボード / プレゼンター用リモコン（→・Space・PageDown で進む、← ・PageUp で戻る） */
  useEffect(() => {
    if (!loaded) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (document.querySelector("[data-modal-open]")) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const forward = ["ArrowRight", "PageDown", " ", "Enter", "ArrowDown"].includes(e.key);
      const backward = ["ArrowLeft", "PageUp", "ArrowUp", "Backspace"].includes(e.key);
      const k = e.key.toLowerCase();

      if (e.key === "Escape" || k === "h") {
        e.preventDefault();
        setMenuOpen((v) => !v);
        return;
      }
      if (menuOpen) return;
      if (k === "f") return void fullscreen.toggle();
      if (k === "v") return void actions.toggleVenue();
      if (!forward && !backward && k !== "s") {
        if (screen === "select" && /^[0-9]$/.test(e.key)) {
          const g = graduates[(Number(e.key) + 9) % 10];
          if (g) actions.selectGraduate(g.id);
        }
        return;
      }
      // ボタンにフォーカスがある状態の Enter/Space は、ボタン自身のクリックに任せる
      if ((e.key === "Enter" || e.key === " ") && t?.tagName === "BUTTON") return;
      e.preventDefault();

      switch (screen) {
        case "top":
          if (forward) game.history.length > 0 ? actions.resume() : actions.start();
          break;
        case "ready":
          if (forward) actions.draw();
          else if (backward) actions.goTo(graduates.length > 1 ? "select" : "top");
          break;
        case "topic":
          if (forward) actions.next();
          else if (backward) actions.back();
          else if (k === "s") actions.skip();
          break;
        case "last-intro":
          if (forward) actions.revealLast();
          else if (backward) backFromLast();
          break;
        case "last-question":
          if (forward) actions.finishLast();
          else if (backward) actions.goTo("last-intro");
          break;
        case "finale":
          if (backward) actions.goTo("last-intro");
          break;
        case "select":
          if (backward) actions.goTo("top");
          break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [loaded, screen, menuOpen, actions, graduates, game.history.length, backFromLast, fullscreen]);

  const venue = settings.venueMode && screen !== "setup";

  return (
    <main
      className={`stage relative h-dvh w-full overflow-hidden ${DARK_SCREENS.has(screen) ? "is-dark" : ""} ${venue ? "venue" : ""}`}
    >
      {loaded && (
        <>
          <AnimatePresence mode="wait">
            <motion.div key={screen} className="absolute inset-0" {...screenFade}>
              {screen === "top" && <TopScreen />}
              {screen === "select" && <SelectScreen />}
              {screen === "ready" && <ReadyScreen />}
              {screen === "topic" && <TopicScreen />}
              {screen === "last-intro" && <LastIntroScreen onBack={backFromLast} />}
              {screen === "last-question" && <LastQuestionScreen />}
              {screen === "finale" && <FinaleScreen />}
              {screen === "setup" && <SetupScreen />}
            </motion.div>
          </AnimatePresence>

          {screen !== "setup" && (
            <HostMenu
              open={menuOpen}
              onOpenChange={setMenuOpen}
              fullscreen={fullscreen}
              onRestart={() =>
                confirm({
                  title: "最初に戻りますか？",
                  body: "進行状況（出たお題・LAST MESSAGE の記録）をリセットしてトップ画面へ戻ります。卒業生とお題の登録は残ります。",
                  ok: "最初に戻る",
                  onOk: () => {
                    setMenuOpen(false);
                    actions.restart();
                  },
                })
              }
            />
          )}
        </>
      )}
    </main>
  );
}
