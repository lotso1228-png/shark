"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "primary" | "ghost" | "quiet";

const base =
  "inline-flex items-center justify-center select-none transition-colors duration-300 disabled:opacity-30 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  // 1画面1アクションの主ボタン。遠目にも分かる細いゴールドの枠
  primary:
    "eyebrow min-h-14 min-w-[12rem] px-10 py-4 text-[clamp(0.95rem,1.6vw,1.35rem)] text-gold-soft border border-gold/70 bg-gold/[0.06] hover:bg-gold/[0.16] active:bg-gold/25",
  ghost:
    "eyebrow min-h-12 px-6 py-3 text-[clamp(0.75rem,1.1vw,0.95rem)] text-ivory/80 border border-ivory/20 hover:border-gold/60 hover:text-gold-soft",
  quiet:
    "min-h-11 px-3 py-2 text-sm text-mist/70 hover:text-gold-soft tracking-widest",
};

export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}: { variant?: Variant; children: ReactNode } & HTMLMotionProps<"button">) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function Hairline({ className = "" }: { className?: string }) {
  return <div aria-hidden className={`hairline ${className}`} />;
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`eyebrow text-gold text-[clamp(0.7rem,1.1vw,1.05rem)] ${className}`}>{children}</p>
  );
}

/** 画面切り替え用のフェード（60fps を意識し opacity / transform のみ） */
export const screenFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, transition: { duration: 0.35, ease: "easeIn" } },
} as const;

/** 文字の軽いスライド */
export const riseIn = (delay = 0) =>
  ({
    initial: { opacity: 0, y: 18 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
    },
  }) as const;

export function BackArrow({ onClick, label = "戻る" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-12 w-12 items-center justify-center rounded-full text-mist/60 transition-colors hover:text-gold-soft"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </button>
  );
}
