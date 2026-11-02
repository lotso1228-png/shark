"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useRoulette, useShuffleOnce } from "../Shuffle";
import { Jp } from "../Jp";

export interface Pick {
  id: string;
  memberId: string;
  name: string;
  names: string[];
}

/**
 * 現役ルーレット：名前が高速で切り替わって止まり、指名された人を大きく表示する。
 * 司会者の画面・参加者のスマホで同じ演出が流れ、当たった本人のスマホは震えて知らせる。
 */
export function MemberPick({ pick, mine = false, onClose }: { pick: Pick | null; mine?: boolean; onClose?: () => void }) {
  return (
    <AnimatePresence>
      {pick && (
        <motion.div
          key={pick.id}
          className="fixed inset-0 z-40 flex items-center justify-center bg-ink/92 px-6 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.35 } }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          onClick={onClose}
        >
          <Spin pick={pick} mine={mine} closable={!!onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Spin({ pick, mine, closable }: { pick: Pick; mine: boolean; closable: boolean }) {
  const winner = Math.max(0, pick.names.indexOf(pick.name));
  const play = useShuffleOnce(`pick-${pick.id}`, pick.names.length > 1);
  const spin = useRoulette(pick.names.length, winner, play);
  const shown = pick.names[spin.index] ?? pick.name;

  useEffect(() => {
    if (spin.done && mine) navigator.vibrate?.([120, 80, 120, 80, 260]);
  }, [spin.done, mine]);

  return (
    <div className="flex w-full max-w-4xl flex-col items-center text-center" aria-live="polite">
      <p className="eyebrow text-[clamp(0.75rem,min(2.4vw,2.2vh),1.3rem)] text-gold">
        Member Roulette<span className="font-mincho ml-3 tracking-[0.2em] text-mist/70">現役ルーレット</span>
      </p>
      <div className="mt-[5vh] flex min-h-[1.4em] items-center text-[clamp(2.6rem,min(12vw,16vh),10rem)] leading-tight font-bold tracking-[0.08em]">
        <span
          className={spin.done ? "gold-text" : "text-ivory/80"}
          style={spin.done ? undefined : { filter: "blur(0.4px)" }}
        >
          {shown}
        </span>
      </div>
      <motion.div
        className="hairline mt-[4vh] w-[min(60vw,24rem)]"
        initial={false}
        animate={{ scaleX: spin.done ? 1 : 0.2, opacity: spin.done ? 1 : 0.4 }}
      />
      <p className="mt-[4vh] min-h-[1.6em] text-[clamp(1rem,min(4vw,3.4vh),2rem)] tracking-[0.2em] text-ivory/90">
        <Jp>{spin.done ? (mine ? "あなたが指名されました！" : "指名されました。お願いします！") : "誰が指名される…？"}</Jp>
      </p>
      {closable && spin.done && <p className="mt-[5vh] text-xs tracking-[0.3em] text-mist/50">タップで閉じる</p>}
    </div>
  );
}
