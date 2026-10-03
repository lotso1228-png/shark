"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { DEFAULT_TOPICS } from "@/lib/topics";
import type { Category } from "@/lib/types";

const appStart = typeof performance !== "undefined" ? performance.now() : 0;
const seen = new Set<string>();

/**
 * このカードをシャッフル演出付きで出すべきか。
 * 初めて表示するカードだけ回す（戻る・再読み込み・途中参加では回さない）。
 */
export function useShuffleOnce(key: string, enabled: boolean) {
  const [play] = useState(() => {
    const fresh = !seen.has(key);
    seen.add(key);
    const reduced =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const booting = performance.now() - appStart < 1500;
    return enabled && fresh && !reduced && !booting;
  });
  return play;
}

/** 一度表示したカードとして記録する（シャッフルを再生しない） */
export const markSeen = (key: string) => seen.add(key);

function decoysFor(cat: Category | "special" | undefined, final: string, n = 16) {
  const pool = DEFAULT_TOPICS.filter(
    (t) => t.text !== final && (cat === undefined || cat === "special" || t.category === cat) && t.category !== "last",
  ).map((t) => t.text.replaceAll("{name}", "〇〇"));
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}

// 最初は速く、だんだん遅く（スロットが止まるように）。合計およそ3.4秒
const STEPS = [
  55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 55, 60, 65, 70, 80, 90, 105, 120,
  140, 165, 195, 230, 275, 330, 400,
];

/**
 * お題のシャッフル演出。ダミーのお題が上から下へ流れて減速し、本命のお題で止まる。
 * 司会者の画面と参加者の画面で同じ演出が同時に流れる。
 */
export function ShuffleReveal({
  play,
  cat,
  text,
  special = false,
  children,
}: {
  play: boolean;
  cat?: Category | "special";
  text: string;
  special?: boolean;
  /** 止まったあとに表示する本命のお題（見出しなど一式） */
  children: ReactNode;
}) {
  const decoys = useMemo(() => (play ? decoysFor(cat, text, STEPS.length) : []), [play, cat, text]);
  const [step, setStep] = useState(play ? 0 : STEPS.length);
  const done = step >= STEPS.length || decoys.length === 0;
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (done) return;
    timer.current = setTimeout(() => setStep((s) => s + 1), STEPS[step]);
    return () => clearTimeout(timer.current);
  }, [step, done]);

  if (done) {
    return (
      <motion.div
        className="relative flex w-full flex-col items-center"
        initial={play ? { opacity: 0, y: 10 } : false}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } }}
      >
        {play && (
          <motion.span
            aria-hidden
            // 枠の外にはみ出すと文字サイズの自動調整が誤作動するため、カードの内側に収める
            className={`pointer-events-none absolute inset-0 ${special ? "border border-gold/70" : ""}`}
            style={{ background: "radial-gradient(50% 50% at 50% 50%, rgba(227,204,156,0.22), transparent 70%)" }}
            initial={{ opacity: 1 }}
            animate={{ opacity: 0, transition: { duration: special ? 1.6 : 1.1, ease: "easeOut" } }}
          />
        )}
        {children}
      </motion.div>
    );
  }

  const d = decoys[step % decoys.length];
  return (
    <div className="flex w-full flex-col items-center" aria-hidden>
      <p className="eyebrow mb-[3.5vh] flex items-center gap-3 text-[clamp(0.7rem,min(1.6vw,2vh),1.2rem)] text-gold-soft">
        Shuffle
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1 w-1 rounded-full bg-gold"
              style={{ opacity: (step + i) % 3 === 0 ? 1 : 0.3 }}
            />
          ))}
        </span>
      </p>
      <div className="relative w-full overflow-hidden" style={{ height: "calc(var(--topic-size) * 2.9)" }}>
        <div
          className="pointer-events-none absolute inset-0 z-10"
          style={{
            background:
              "linear-gradient(180deg, var(--color-ink) 0%, transparent 28%, transparent 72%, var(--color-ink) 100%)",
            opacity: 0.85,
          }}
        />
        <AnimatePresence initial={false}>
          <motion.p
            key={step}
            className="topic-text absolute inset-x-0 top-1/2 text-ivory/45"
            style={{ fontSize: "calc(var(--topic-size) * 0.72)" }}
            initial={{ y: "-130%", opacity: 0 }}
            animate={{ y: "-50%", opacity: 1, transition: { duration: Math.min(0.18, STEPS[step] / 1000), ease: "linear" } }}
            exit={{ y: "60%", opacity: 0, transition: { duration: Math.min(0.18, STEPS[step] / 1000), ease: "linear" } }}
          >
            {d}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ルーレット：名前の上を光が巡り、だんだん遅くなって止まる。合計およそ2.6秒
const ROULETTE = [70, 70, 70, 70, 70, 75, 80, 85, 90, 100, 110, 125, 140, 160, 185, 215, 250, 300, 360];

/** 卒業生ルーレットの光っている位置。止まると done=true */
export function useRoulette(count: number, winner: number, play: boolean) {
  const total = ROULETTE.length;
  // 最後のステップで必ず当選者に止まるよう、開始位置を逆算する
  const start = (((winner - (total - 1)) % Math.max(count, 1)) + Math.max(count, 1)) % Math.max(count, 1);
  const [step, setStep] = useState(play && count > 1 ? 0 : total - 1);
  const done = step >= total - 1;
  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => setStep((s) => s + 1), ROULETTE[step]);
    return () => clearTimeout(t);
  }, [step, done]);
  return { index: count > 1 ? (start + step) % count : winner, done };
}
