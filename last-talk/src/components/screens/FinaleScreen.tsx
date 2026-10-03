"use client";

import { motion } from "framer-motion";
import { Confetti } from "../Confetti";
import { displayName, useStore } from "../StoreProvider";
import { BackArrow } from "../ui";

const reveal = (delay: number, y = 16) =>
  ({
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0, transition: { duration: 1.8, delay, ease: [0.22, 1, 0.36, 1] } },
  }) as const;

export function FinaleScreen() {
  const { graduates, settings, actions } = useStore();

  return (
    <div className="relative flex h-full flex-col px-5 pt-4 safe-bottom sm:px-10">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: 1.6, duration: 2 } }}
      >
        <Confetti />
      </motion.div>

      <div className="relative z-10 flex items-center">
        {!settings.venueMode && <BackArrow onClick={() => actions.goTo("last-intro")} />}
      </div>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
        <motion.p {...reveal(0.3, 0)} className="eyebrow text-[clamp(0.75rem,min(1.6vw,2.4vh),1.5rem)] text-gold/80">
          Congratulations
        </motion.p>
        <motion.h1
          {...reveal(0.8, 24)}
          className="gold-text mt-[4vh] text-[clamp(2.1rem,min(6.4vw,12vh),9rem)] leading-[1.3] font-extrabold tracking-[0.1em]"
          style={{ wordBreak: "keep-all" }}
        >
          卒業<wbr />おめでとう<wbr />ございます
        </motion.h1>
        <motion.div
          className="hairline my-[5vh] w-[min(60vw,32rem)]"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1, transition: { duration: 1.8, delay: 2 } }}
        />
        <motion.p
          {...reveal(2.6)}
          className="text-[clamp(1.2rem,min(3.4vw,5.4vh),4.2rem)] font-semibold tracking-[0.22em] text-ivory/95"
        >
          出会えたことに、ありがとう。
        </motion.p>
        {graduates.length > 0 && (
          <motion.p
            {...reveal(4, 0)}
            className="mt-[6vh] max-w-5xl text-[clamp(0.8rem,min(1.6vw,2.6vh),1.6rem)] leading-loose tracking-[0.3em] text-mist/80"
          >
            {graduates.map(displayName).join("　·　")}
          </motion.p>
        )}
      </div>
      <div className="h-[6vh]" />
    </div>
  );
}
