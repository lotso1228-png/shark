"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { FINALE_PROMPT } from "@/lib/topics";
import { displayName, useStore } from "../StoreProvider";
import { BackArrow, Button } from "../ui";
import { useFitText } from "../useFitText";

const slow = (delay: number, y = 12) =>
  ({
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0, transition: { duration: 1.4, delay, ease: [0.22, 1, 0.36, 1] } },
  }) as const;

/** クライマックス：暗転 →「LAST MESSAGE」→「最後に、仲間へ伝えたいこと。」→ MESSAGE */
export function LastIntroScreen({ onBack }: { onBack: () => void }) {
  const { game, graduates, graduate, settings, letters, actions } = useStore();
  const name = displayName(graduate);
  const letterCount = letters.filter((l) => l.to === game.graduateId).length;

  return (
    <div className="flex h-full flex-col px-5 pt-4 safe-bottom sm:px-10">
      <div className="flex items-center">
        {!settings.venueMode && <BackArrow onClick={onBack} />}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <motion.p
          {...slow(0.3, 0)}
          className="eyebrow gold-text font-display text-[clamp(1rem,min(2.4vw,3.8vh),2.4rem)] tracking-[0.5em]"
        >
          Last Message
        </motion.p>
        <motion.div
          className="hairline my-[5vh] w-[min(56vw,30rem)] origin-center"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1, transition: { duration: 1.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] } }}
        />
        <motion.h1 {...slow(1.6)} className="topic-text font-semibold">
          {FINALE_PROMPT}
        </motion.h1>
        <AnimatePresence mode="wait">
          <motion.p
            key={game.graduateId ?? "none"}
            {...slow(game.lastDone.length ? 0.3 : 2.4)}
            exit={{ opacity: 0 }}
            className="name-text mt-[5vh] tracking-[0.2em] text-gold-soft"
          >
            {name}
          </motion.p>
        </AnimatePresence>
      </div>

      <motion.div {...slow(game.lastDone.length ? 0.6 : 3)} className="flex flex-col items-center gap-5 pb-[5vh]">
        {graduates.length > 1 && !settings.venueMode && (
          <ul className="flex max-w-3xl flex-wrap justify-center gap-2" aria-label="話す卒業生">
            {graduates.map((g) => {
              const done = game.lastDone.includes(g.id);
              const active = g.id === game.graduateId;
              return (
                <li key={g.id}>
                  <button
                    type="button"
                    onClick={() => actions.chooseLastGraduate(g.id)}
                    className={`min-h-9 border px-3 py-1 text-xs tracking-widest transition-colors ${
                      active
                        ? "border-gold/70 text-gold-soft"
                        : done
                          ? "border-transparent text-mist/30 line-through"
                          : "border-ivory/10 text-mist/70 hover:text-gold-soft"
                    }`}
                  >
                    {displayName(g)}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
        {letterCount > 0 && graduate && (
          <Button variant="ghost" onClick={() => actions.openLetters(graduate.id)}>
            寄せ書き（{letterCount}件）を流す
          </Button>
        )}
        <Button onClick={actions.revealLast} disabled={!graduate} className="min-w-[14rem]">
          Message
        </Button>
      </motion.div>
    </div>
  );
}

export function LastQuestionScreen() {
  const { game, graduates, graduate, actions } = useStore();
  const name = displayName(graduate);
  const fitRef = useRef<HTMLDivElement>(null);
  useFitText(fitRef, [game.lastCard?.text]);
  const remaining = graduates.filter(
    (g) => !game.lastDone.includes(g.id) && g.id !== game.graduateId,
  ).length;

  return (
    <div className="flex h-full flex-col px-5 pt-4 safe-bottom sm:px-10">
      <div className="flex items-center">
        <BackArrow onClick={() => actions.goTo("last-intro")} />
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        <div ref={fitRef} className="flex flex-col items-center text-center">
          <motion.p {...slow(0.2, 0)} className="name-text tracking-[0.2em] text-gold-soft">
            {name}
          </motion.p>
          <motion.div
            className="hairline my-[5vh] w-[min(40vw,20rem)]"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1, transition: { duration: 1.2, delay: 0.4 } }}
          />
          <motion.h1 {...slow(0.8, 20)} className="topic-text max-w-[min(92vw,1600px)]">
            {game.lastCard?.text}
          </motion.h1>
        </div>
      </div>

      <motion.div {...slow(2)} className="flex flex-col items-center gap-2 pb-[5vh]">
        <Button onClick={() => actions.finishLast()}>
          {remaining > 0 ? "次の卒業生へ" : "Finale"}
        </Button>
        {remaining > 0 && (
          <Button variant="quiet" onClick={() => actions.finishLast(true)}>
            フィナーレへ進む
          </Button>
        )}
      </motion.div>
    </div>
  );
}
