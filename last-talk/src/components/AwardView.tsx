"use client";

import { motion } from "framer-motion";
import type { AwardEntry } from "@/lib/live";
import { REACTIONS } from "@/lib/liveChannel";
import { Confetti } from "./Confetti";
import { Button, Eyebrow, Hairline } from "./ui";

const STEP = 1.1; // 1人ずつ発表する間隔（秒）
const DRUMROLL = 1.4; // 優勝者の前のため

/**
 * 優勝発表：現役のリアクションが一番多かった卒業生。
 * 下位から1人ずつバーが伸び、最後に優勝者を大きく出す。司会者・参加者の画面で共通。
 */
export function AwardView({
  rows,
  revealed,
  onReveal,
  onFinale,
}: {
  rows: AwardEntry[];
  revealed: boolean;
  onReveal?: () => void;
  onFinale?: () => void;
}) {
  const max = Math.max(1, ...rows.map((r) => r.total));
  const winners = rows.filter((r) => r.rank === 1 && r.total > 0);
  // 発表は下位から。表示は上が1位
  const order = [...rows].reverse();
  const delayOf = (name: string) => {
    const i = order.findIndex((r) => r.name === name);
    const isWinner = winners.some((w) => w.name === name);
    return 0.5 + i * STEP + (isWinner ? DRUMROLL : 0);
  };
  const finalAt = 0.5 + (order.length - 1) * STEP + DRUMROLL + 1;

  if (!revealed) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-[4vh] px-6 text-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 1 } }}>
          <Eyebrow>Award</Eyebrow>
        </motion.div>
        <motion.h1
          className="gold-text text-[clamp(2.4rem,min(9vw,13vh),8rem)] leading-tight font-extrabold tracking-[0.1em]"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 1.2, delay: 0.3 } }}
        >
          本日の優勝は…
        </motion.h1>
        <motion.p
          className="text-[clamp(0.95rem,min(3.6vw,3vh),1.8rem)] tracking-[0.16em] text-ivory/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 1, delay: 1 } }}
        >
          現役のリアクションが一番多かった卒業生
        </motion.p>
        <motion.div
          className="hairline w-[min(50vw,22rem)]"
          animate={{ opacity: [0.3, 1, 0.3], transition: { duration: 1.6, repeat: Infinity } }}
        />
        {onReveal && <Button onClick={onReveal}>結果発表</Button>}
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col items-center justify-center px-5 text-center">
      {winners.length > 0 && (
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: finalAt, duration: 1 } }}
        >
          <Confetti duration={9000} />
        </motion.div>
      )}
      <div className="relative z-10 flex w-full max-w-4xl flex-col items-center">
        <Eyebrow>Award</Eyebrow>

        {/* 優勝者（最後に出す） */}
        <motion.div
          className="mt-[2vh] min-h-[calc(clamp(2.2rem,min(9vw,12vh),7rem)*1.3)]"
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1, transition: { delay: finalAt - 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] } }}
        >
          <p className="gold-text text-[clamp(2.2rem,min(9vw,12vh),7rem)] leading-tight font-extrabold tracking-[0.08em]">
            {winners.length ? winners.map((w) => w.name).join("・") : "全員優勝！"}
          </p>
          <p className="mt-1 text-[clamp(0.9rem,min(3.4vw,2.8vh),1.6rem)] tracking-[0.2em] text-ivory/85">
            {winners.length > 1 ? "同点優勝、おめでとうございます！" : "優勝、おめでとうございます！"}
          </p>
        </motion.div>

        <Hairline className="my-[3.5vh] w-[min(60vw,28rem)]" />

        {/* 順位（バーの長さはリアクション数に比例） */}
        <ol className="flex w-full flex-col gap-[1.6vh]" aria-label="順位">
          {rows.map((r) => {
            const win = winners.some((w) => w.name === r.name);
            const d = delayOf(r.name);
            return (
              <motion.li
                key={r.name}
                className="grid grid-cols-[3.2rem_minmax(0,7rem)_1fr_auto] items-center gap-3 text-left sm:grid-cols-[4rem_minmax(0,10rem)_1fr_auto]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0, transition: { delay: d, duration: 0.5 } }}
              >
                <span className={`font-display text-[clamp(1.1rem,3vw,2rem)] ${win ? "text-gold" : "text-mist/70"}`}>
                  {r.rank}位
                </span>
                <span className={`truncate text-[clamp(1rem,3.4vw,1.9rem)] font-semibold tracking-[0.06em] ${win ? "text-gold-soft" : ""}`}>
                  {r.name}
                </span>
                <span className="relative h-[clamp(0.6rem,1.6vh,1.1rem)] overflow-hidden rounded-full bg-ivory/[0.07]">
                  <motion.span
                    className={`absolute inset-y-0 left-0 rounded-full ${win ? "bg-gold" : "bg-ivory/45"}`}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${r.total > 0 ? Math.max(3, (r.total / max) * 100) : 0}%`,
                      transition: { delay: d + 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                    }}
                  />
                </span>
                <span className="flex flex-col items-end">
                  <span className={`text-[clamp(1rem,3vw,1.8rem)] font-semibold tabular-nums ${win ? "text-gold-soft" : ""}`}>
                    {r.total}
                  </span>
                  <span className="text-[0.62rem] whitespace-nowrap text-mist/70 tabular-nums">
                    {REACTIONS.filter((x) => (r.counts[x.kind] ?? 0) > 0)
                      .map((x) => `${x.emoji}${r.counts[x.kind]}`)
                      .join(" ")}
                  </span>
                </span>
              </motion.li>
            );
          })}
        </ol>

        {onFinale && (
          <motion.div
            className="mt-[5vh]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: finalAt + 0.8 } }}
          >
            <Button onClick={onFinale}>Finale</Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
