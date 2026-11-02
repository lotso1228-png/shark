"use client";

import { motion } from "framer-motion";
import { useConfirm } from "../Confirm";
import { useOpenShare } from "../live/LiveProvider";
import { useStore } from "../StoreProvider";
import { Button, Hairline, riseIn } from "../ui";

export function TopScreen() {
  const { game, graduates, actions } = useStore();
  const confirm = useConfirm();
  const openShare = useOpenShare();
  const inProgress = game.history.length > 0;

  const onStart = () => {
    if (!inProgress) return actions.start();
    confirm({
      title: "新しく始めますか？",
      body: "前回の進行状況（出たお題など）をリセットして、最初から始めます。",
      ok: "最初から始める",
      onOk: actions.start,
    });
  };

  return (
    <div className="flex h-full flex-col items-center justify-between px-6 py-[6vh] text-center">
      <div className="flex w-full justify-between">
        {openShare ? (
          <button
            type="button"
            onClick={openShare}
            className="eyebrow min-h-11 px-3 text-[0.7rem] text-mist/50 transition-colors hover:text-gold-soft"
          >
            参加者用QR
          </button>
        ) : (
          <span />
        )}
        <button
          type="button"
          onClick={() => actions.goTo("setup")}
          className="eyebrow min-h-11 px-3 text-[0.7rem] text-mist/50 transition-colors hover:text-gold-soft"
        >
          Setup
        </button>
      </div>

      <div className="flex flex-col items-center">
        <motion.p {...riseIn(0.1)} className="eyebrow mb-[3vh] text-[clamp(0.65rem,1vw,0.95rem)] text-gold/80">
          Graduation Night
        </motion.p>
        <motion.h1
          {...riseIn(0.25)}
          className="gold-text font-display text-[clamp(3.6rem,min(14vw,22vh),14rem)] leading-[0.9] font-light tracking-[0.06em]"
        >
          LAST&nbsp;TALK
        </motion.h1>
        <motion.div {...riseIn(0.5)} className="my-[4vh] w-[min(60vw,28rem)]">
          <Hairline />
        </motion.div>
        <motion.p
          {...riseIn(0.7)}
          className="text-[clamp(1rem,min(2.4vw,3.6vh),2.1rem)] leading-[2] tracking-[0.18em] text-ivory/90"
        >
          卒業するその前に、
          <br />
          聞いておきたい話がある。
        </motion.p>
      </div>

      <motion.div {...riseIn(1)} className="flex flex-col items-center gap-3">
        {inProgress ? (
          <>
            <Button onClick={actions.resume}>Continue</Button>
            <Button variant="quiet" onClick={onStart}>
              最初から始める
            </Button>
          </>
        ) : (
          <Button onClick={onStart}>Start</Button>
        )}
        {graduates.length === 0 && (
          <p className="text-xs tracking-widest text-mist/60">
            はじめに卒業生を登録します
          </p>
        )}
      </motion.div>
    </div>
  );
}
