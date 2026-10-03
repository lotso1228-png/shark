"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const big = "text-[clamp(2.4rem,min(12vw,14vh),8rem)] leading-tight font-extrabold tracking-[0.08em]";
const shell = (audience: boolean) =>
  `fixed inset-x-0 top-0 z-[25] flex items-center justify-center bg-ink/92 px-6 backdrop-blur-sm ${
    audience ? "bottom-[8.6rem]" : "bottom-0"
  }`;

/* ───────── エピソード判定（リアクションが少なかった → 卒業生が一杯） ───────── */

export interface PenaltyInfo {
  id: string;
  name: string;
  count: number;
  target: number;
}

export function PenaltyOverlay({
  penalty,
  onNext,
  audience = false,
}: {
  penalty: PenaltyInfo | null;
  onNext?: () => void;
  audience?: boolean;
}) {
  useEffect(() => {
    if (penalty && audience) navigator.vibrate?.([200, 100, 200]);
  }, [penalty, audience]);
  return (
    <AnimatePresence>
      {penalty && (
        <motion.div
          key={penalty.id}
          className={shell(audience)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onNext}
        >
          <motion.div
            className="flex flex-col items-center text-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
          >
            <p className="eyebrow text-[clamp(0.75rem,min(2.4vw,2.2vh),1.3rem)] text-gold">
              Episode Judge<span className="font-mincho ml-3 tracking-[0.2em] text-mist/70">エピソード判定</span>
            </p>
            <p className="mt-[2vh] text-[clamp(1rem,min(4vw,3.4vh),2rem)] tracking-[0.14em] text-ivory/85">
              リアクションが足りませんでした…
            </p>
            <p className={`mt-[2vh] ${big} text-ivory`}>アウト！</p>
            <p className="gold-text mt-[2vh] text-[clamp(1.6rem,min(7vw,7vh),4.2rem)] font-bold tracking-[0.1em]">
              {penalty.name}、一杯！🍺
            </p>
            <p className="mt-[2vh] text-[clamp(0.85rem,min(3vw,2.4vh),1.4rem)] tracking-[0.16em] text-mist/80 tabular-nums">
              リアクション {penalty.count} ／ 目標 {penalty.target}
            </p>
            <p className="mt-2 text-xs tracking-[0.2em] text-mist/60">ソフトドリンクでもOK。無理はしないでください</p>
            {onNext && <p className="mt-[4vh] text-xs tracking-[0.3em] text-mist/50">タップ（NEXT）で次のお題へ</p>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────── ホント？盛ってる？ ───────── */

export interface VoteInfo {
  id: string;
  name: string;
  seconds: number;
  result?: "real" | "fake";
  real?: number;
  fake?: number;
}

function useCountdown(id: string, seconds: number, endsAt?: number) {
  const [start] = useState(() => Date.now());
  const end = endsAt ?? start + seconds * 1000;
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(t);
  }, [id]);
  return Math.max(0, Math.ceil((end - now) / 1000));
}

export function VoteOverlay({
  vote,
  endsAt,
  live,
  onVote,
  onClose,
  audience = false,
}: {
  vote: VoteInfo | null;
  endsAt?: number;
  /** 司会者の画面に出す途中の票数 */
  live?: { real: number; fake: number };
  onVote?: (choice: "real" | "fake") => void;
  onClose?: () => void;
  audience?: boolean;
}) {
  return (
    <AnimatePresence>
      {vote && (
        <motion.div
          key={vote.id}
          className={shell(audience)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={vote.result ? onClose : undefined}
        >
          <VoteBody vote={vote} endsAt={endsAt} live={live} onVote={onVote} audience={audience} closable={!!onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function VoteBody({
  vote,
  endsAt,
  live,
  onVote,
  audience,
  closable,
}: {
  vote: VoteInfo;
  endsAt?: number;
  live?: { real: number; fake: number };
  onVote?: (choice: "real" | "fake") => void;
  audience: boolean;
  closable: boolean;
}) {
  const remaining = useCountdown(vote.id, vote.seconds, endsAt);
  const [mine, setMine] = useState<"real" | "fake" | null>(null);

  useEffect(() => {
    if (vote.result === "fake" && audience) navigator.vibrate?.([200, 100, 200]);
  }, [vote.result, audience]);

  if (vote.result) {
    const fake = vote.result === "fake";
    return (
      <motion.div
        className="flex flex-col items-center text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
      >
        <p className="eyebrow text-[clamp(0.75rem,min(2.4vw,2.2vh),1.3rem)] text-gold">
          Real or Fake<span className="font-mincho ml-3 tracking-[0.2em] text-mist/70">ホント？盛ってる？</span>
        </p>
        <p className={`mt-[2vh] ${big} ${fake ? "text-ivory" : "gold-text"}`}>{fake ? "盛ってる！" : "ホント！"}</p>
        <p className="mt-[2vh] text-[clamp(1.3rem,min(6vw,6vh),3.4rem)] font-bold tracking-[0.1em] text-ivory/95">
          {fake ? `${vote.name}、一杯！🍺` : "信じてもらえました 👏"}
        </p>
        <p className="mt-[2vh] text-[clamp(0.9rem,min(3.4vw,2.6vh),1.5rem)] tracking-[0.16em] text-mist/85 tabular-nums">
          ホント {vote.real ?? 0} ／ 盛ってる {vote.fake ?? 0}
        </p>
        {fake && <p className="mt-2 text-xs tracking-[0.2em] text-mist/60">ソフトドリンクでもOK。無理はしないでください</p>}
        {closable && <p className="mt-[4vh] text-xs tracking-[0.3em] text-mist/50">タップで閉じる</p>}
      </motion.div>
    );
  }

  const done = remaining <= 0;
  return (
    <div className="flex w-full max-w-xl flex-col items-center text-center">
      <p className="eyebrow text-[clamp(0.75rem,min(2.4vw,2.2vh),1.3rem)] text-gold">Real or Fake</p>
      <p className="gold-text mt-[2vh] text-[clamp(2rem,min(9vw,10vh),6rem)] leading-tight font-extrabold tracking-[0.06em]">
        ホント？盛ってる？
      </p>
      <p className="mt-[1.5vh] text-[clamp(0.95rem,min(3.6vw,3vh),1.8rem)] tracking-[0.1em] text-ivory/90">
        {vote.name}の今の話は…（盛ってる判定なら一杯）
      </p>
      <p className="mt-[2vh] font-display text-[clamp(2.4rem,min(12vw,12vh),7rem)] leading-none text-gold-soft tabular-nums">
        {done ? "…" : remaining}
      </p>
      {audience ? (
        mine ? (
          <p className="mt-[3vh] text-sm tracking-[0.2em] text-ivory/80">
            「{mine === "real" ? "ホント" : "盛ってる"}」に投票しました
          </p>
        ) : done ? (
          <p className="mt-[3vh] text-sm tracking-[0.2em] text-mist/70">集計中…</p>
        ) : (
          <div className="mt-[3vh] grid w-full grid-cols-2 gap-3">
            {(
              [
                ["real", "ホント", "🙆"],
                ["fake", "盛ってる", "🤥"],
              ] as const
            ).map(([c, label, emoji]) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  setMine(c);
                  onVote?.(c);
                  navigator.vibrate?.(10);
                }}
                className={`flex min-h-24 flex-col items-center justify-center gap-1 border text-xl font-bold tracking-[0.12em] ${
                  c === "real" ? "border-gold/70 bg-gold/10 text-gold-soft" : "border-ivory/30 bg-white/[0.04] text-ivory"
                }`}
              >
                <span className="text-3xl">{emoji}</span>
                {label}
              </button>
            ))}
          </div>
        )
      ) : (
        <p className="mt-[3vh] text-[clamp(0.9rem,min(3.4vw,2.6vh),1.5rem)] tracking-[0.16em] text-mist/85 tabular-nums">
          {done ? "集計中…" : `ホント ${live?.real ?? 0} ／ 盛ってる ${live?.fake ?? 0}`}
        </p>
      )}
    </div>
  );
}
