"use client";

import { motion } from "framer-motion";
import { displayName, useStore } from "../StoreProvider";
import { FlowIndicator } from "../FlowIndicator";
import { BackArrow, Button, Eyebrow, Hairline, riseIn } from "../ui";

export function ReadyScreen() {
  const { graduate, graduates, game, actions } = useStore();
  const back = () => actions.goTo(graduates.length > 1 ? "select" : "top");

  return (
    <div className="flex h-full flex-col px-5 pt-4 safe-bottom sm:px-10">
      <div className="flex items-center justify-between">
        <BackArrow onClick={back} />
        <FlowIndicator current={game.chapter} />
        <span className="w-12" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <motion.div {...riseIn(0.05)}>
          <Eyebrow>Next Speaker</Eyebrow>
        </motion.div>
        <motion.button
          {...riseIn(0.2)}
          type="button"
          onClick={() => graduates.length > 1 && actions.goTo("select")}
          className="gold-text mt-[3vh] text-[clamp(2.8rem,min(9vw,15vh),10rem)] leading-tight font-bold tracking-[0.08em]"
        >
          {displayName(graduate)}
        </motion.button>
        <motion.div {...riseIn(0.35)} className="mt-[4vh] w-[min(50vw,22rem)]">
          <Hairline />
        </motion.div>
      </div>

      <motion.div {...riseIn(0.5)} className="flex justify-center pb-[6vh]">
        <Button onClick={actions.draw} disabled={!graduate} className="min-w-[16rem] !tracking-[0.3em]">
          お題を引く
        </Button>
      </motion.div>
    </div>
  );
}
