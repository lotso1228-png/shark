"use client";

import { motion } from "framer-motion";
import { countFor } from "@/lib/engine";
import { displayName, useStore } from "../StoreProvider";
import { BackArrow, Button, Eyebrow } from "../ui";

export function SelectScreen() {
  const { graduates, game, actions } = useStore();
  const many = graduates.length > 4;

  return (
    <div className="flex h-full flex-col px-5 pt-4 safe-bottom sm:px-10">
      <div className="flex items-center justify-between">
        <BackArrow onClick={() => actions.goTo("top")} />
      </div>

      <div className="mt-[2vh] text-center">
        <Eyebrow>Who&apos;s next</Eyebrow>
        <h2 className="mt-3 text-[clamp(1.2rem,min(3vw,4.5vh),2.6rem)] tracking-[0.2em] text-ivory/90">
          話す卒業生を選んでください
        </h2>
      </div>

      {graduates.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <p className="text-mist">卒業生が登録されていません</p>
          <Button onClick={() => actions.goTo("setup")}>卒業生を登録</Button>
        </div>
      ) : (
        <div className="scroll-thin flex flex-1 items-center justify-center overflow-y-auto py-[4vh]">
          <ul
            className={`grid w-full max-w-6xl gap-3 sm:gap-4 ${
              many ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1 sm:grid-cols-2"
            }`}
          >
            {graduates.map((g, i) => {
              const n = countFor(game, g.id);
              const current = g.id === game.graduateId;
              return (
                <motion.li
                  key={g.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.1 + i * 0.05, duration: 0.6 } }}
                >
                  <button
                    type="button"
                    onClick={() => actions.selectGraduate(g.id)}
                    className={`group flex w-full items-center justify-between gap-4 border px-6 py-[min(3.2vh,1.6rem)] text-left transition-colors duration-300 ${
                      current
                        ? "border-gold/60 bg-gold/[0.07]"
                        : "border-ivory/12 bg-white/[0.02] hover:border-gold/50"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-[clamp(1.4rem,min(3.4vw,5.2vh),3rem)] font-semibold tracking-[0.08em] group-hover:text-gold-soft">
                        {displayName(g)}
                      </span>
                      {g.nickname && g.name && g.nickname !== g.name && (
                        <span className="mt-1 block truncate text-sm tracking-widest text-mist/70">
                          {g.name}
                        </span>
                      )}
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-2">
                      <span className="font-display text-sm text-mist/40">{String(i + 1).padStart(2, "0")}</span>
                      <span className="flex gap-1" aria-label={`回答 ${n} 回`}>
                        {Array.from({ length: Math.min(n, 8) }).map((_, k) => (
                          <span key={k} className="h-1.5 w-1.5 rounded-full bg-gold/70" />
                        ))}
                      </span>
                    </span>
                  </button>
                </motion.li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
