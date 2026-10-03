"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef } from "react";
import { currentEntry, isFlowComplete } from "@/lib/engine";
import { cardView } from "@/lib/cardView";
import { displayName, useStore } from "../StoreProvider";
import { FlowIndicator } from "../FlowIndicator";
import { BackArrow, Button } from "../ui";
import { useFitText } from "../useFitText";
import { ShuffleReveal, useShuffleOnce } from "../Shuffle";

export function TopicScreen() {
  const { game, graduates, settings, actions } = useStore();
  const entry = currentEntry(game);
  const grad = graduates.find((g) => g.id === entry?.graduateId) ?? null;
  const name = displayName(grad) || "卒業生";
  const venue = settings.venueMode;

  if (!entry) {
    return (
      <div className="flex h-full items-center justify-center">
        <Button onClick={() => actions.goTo("ready")}>お題を引く</Button>
      </div>
    );
  }

  const view = cardView(entry.card, name);
  const canNominate =
    entry.card.kind === "topic" && entry.card.category === "friends";
  const flowDone = isFlowComplete(game, graduates.length);

  return (
    <div className="flex h-full flex-col px-5 pt-[max(1rem,env(safe-area-inset-top))] safe-bottom sm:px-10">
      {/* 上部：卒業生の名前（タップで卒業生を変更） */}
      <header className="relative flex items-start justify-center pt-[2vh] text-center">
        <button
          type="button"
          onClick={() => actions.goTo("select")}
          className="name-text font-semibold tracking-[0.16em] text-gold-soft transition-opacity hover:opacity-80"
          aria-label={`${name}（タップで卒業生を変更）`}
        >
          {/* 話す人が替わったら名前を入れ替えて知らせる */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={name}
              className="inline-block"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.2 } }}
            >
              {name}
            </motion.span>
          </AnimatePresence>
        </button>
        {!venue && (
          <div className="absolute top-[2vh] right-0 hidden sm:block">
            <FlowIndicator current={game.chapter} />
          </div>
        )}
      </header>

      {/* 中央：お題 */}
      <section
        className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden"
        aria-live="polite"
      >
        <AnimatePresence mode="wait">
          <FitCard
            key={`${game.cursor}-${entry.card.kind === "topic" ? entry.card.topicId : entry.card.kind}`}
            fitKey={`${view.text}-${venue}`}
            initial={{ opacity: 0, y: 26 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
            }}
            exit={{
              opacity: 0,
              y: -14,
              transition: { duration: 0.28, ease: "easeIn" },
            }}
          >
            <Shuffled
              shuffleKey={`${game.cursor}-${view.text}`}
              enabled={
                settings.shuffleFx !== false &&
                game.cursor === game.history.length - 1 &&
                entry.card.kind !== "reply"
              }
              cat={
                entry.card.kind === "topic" ? entry.card.category : "special"
              }
              text={view.text}
              special={view.special}
            >
              <p
                className={`eyebrow mb-[3.5vh] text-[clamp(0.7rem,min(1.3vw,2vh),1.2rem)] ${
                  view.special ? "text-gold-soft" : "text-gold/80"
                }`}
              >
                {view.special && (
                  <span className="mr-3 inline-block align-middle text-[0.7em]">
                    ◆
                  </span>
                )}
                {view.label}
                <span className="ml-3 font-mincho tracking-[0.2em] text-mist/60">
                  {view.sub}
                </span>
              </p>
              {view.special && (
                <div className="hairline mb-[4vh] w-[min(40vw,18rem)]" />
              )}
              <h1 className="topic-text">{view.text}</h1>
              {view.note && !venue && (
                <p className="mt-[4vh] text-[clamp(0.85rem,min(1.6vw,2.6vh),1.5rem)] tracking-[0.14em] text-mist/80">
                  {view.note}
                </p>
              )}
            </Shuffled>
          </FitCard>
        </AnimatePresence>
      </section>

      {/* 下部：NEXT（1画面1アクション） */}
      <footer className="relative flex flex-col items-center gap-3 pb-[3vh]">
        <div className="flex min-h-12 items-center justify-center gap-3">
          {canNominate && (
            <Button variant="ghost" onClick={actions.reply}>
              その人を指名する
            </Button>
          )}
          {flowDone && !canNominate && (
            <Button variant="ghost" onClick={actions.enterLast}>
              Last Message ›
            </Button>
          )}
        </div>
        <div className="flex w-full items-center justify-center">
          {!venue && (
            <div className="absolute left-0">
              <BackArrow onClick={actions.back} label="ひとつ前のお題に戻る" />
            </div>
          )}
          <Button onClick={actions.next} className={venue ? "opacity-70" : ""}>
            Next
          </Button>
        </div>
      </footer>
    </div>
  );
}

function FitCard({
  fitKey,
  children,
  ...motionProps
}: { fitKey: string; children: React.ReactNode } & React.ComponentProps<
  typeof motion.div
>) {
  const ref = useRef<HTMLDivElement>(null);
  useFitText(ref, [fitKey]);
  return (
    <motion.div
      ref={ref}
      className="flex w-full max-w-[min(92vw,1600px)] flex-col items-center py-2 text-center"
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}

function Shuffled({
  shuffleKey,
  enabled,
  ...rest
}: { shuffleKey: string; enabled: boolean } & Omit<
  React.ComponentProps<typeof ShuffleReveal>,
  "play"
>) {
  const play = useShuffleOnce(shuffleKey, enabled);
  return <ShuffleReveal play={play} {...rest} />;
}
