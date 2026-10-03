"use client";

import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { REACTIONS, type LiveChannel, type ReactionKind, type Reactions } from "@/lib/liveChannel";

const EMOJI = Object.fromEntries(REACTIONS.map((r) => [r.kind, r.emoji])) as Record<ReactionKind, string>;
const MAX_FLOATING = 40;

interface Float {
  id: number;
  emoji: string;
  x: number;
  sway: number;
  size: number;
  dur: number;
  delay: number;
}

export interface ReactionLayerHandle {
  burst(r: Reactions): void;
}

/** 画面下から浮かび上がるリアクション（司会者・参加者の画面で共通） */
export const ReactionLayer = forwardRef<
  ReactionLayerHandle,
  { big?: boolean; edges?: boolean; bottom?: string }
>(function ReactionLayer({ big = false, edges = false, bottom = "6vh" }, ref) {
  const [items, setItems] = useState<Float[]>([]);
  const seq = useRef(0);

  const burst = useCallback(
    (r: Reactions) => {
      if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
      const add: Float[] = [];
      for (const [kind, n] of Object.entries(r) as [ReactionKind, number][]) {
        for (let i = 0; i < Math.min(n, 6); i++) {
          add.push({
            id: ++seq.current,
            emoji: EMOJI[kind],
            // 司会者の画面では左右の端から浮かべて、お題とボタンを隠さない
            x: edges ? (Math.random() < 0.5 ? 1 + Math.random() * 13 : 86 + Math.random() * 11) : 6 + Math.random() * 84,
            sway: (Math.random() - 0.5) * (edges ? 60 : 120),
            size: (big ? 3.2 : 2.2) * (0.8 + Math.random() * 0.5),
            dur: 2.4 + Math.random() * 1.2,
            delay: Math.random() * 0.25,
          });
        }
      }
      // 同時に出す数を抑えてなめらかさを保つ
      setItems((cur) => [...cur, ...add].slice(-MAX_FLOATING));
    },
    [big, edges],
  );
  useImperativeHandle(ref, () => ({ burst }), [burst]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-20 overflow-hidden"
      style={{ "--rbottom": bottom } as React.CSSProperties}
    >
      {items.map((f) => (
        <span
          key={f.id}
          className="reaction-float"
          style={
            {
              left: `${f.x}%`,
              "--sway": `${f.sway}px`,
              "--rsize": `${f.size}rem`,
              "--rdur": `${f.dur}s`,
              animationDelay: `${f.delay}s`,
            } as React.CSSProperties
          }
          onAnimationEnd={() => setItems((cur) => cur.filter((x) => x.id !== f.id))}
        >
          {f.emoji}
        </span>
      ))}
    </div>
  );
});

/** 司会者側：参加者から届いたリアクションを画面に浮かべる */
export function HostReactions({ channel, active, big }: { channel: LiveChannel | null; active: boolean; big?: boolean }) {
  const layer = useRef<ReactionLayerHandle>(null);
  useEffect(() => {
    if (!active || !channel?.onReactions) return;
    return channel.onReactions((r) => layer.current?.burst(r));
  }, [active, channel]);
  if (!active || !channel?.onReactions) return null;
  return <ReactionLayer ref={layer} big={big} edges bottom="4vh" />;
}

/** 参加者側：リアクションボタン */
export function ReactionBar({ onReact }: { onReact: (k: ReactionKind) => void }) {
  return (
    <div className="flex items-end justify-center gap-[min(4vw,1.5rem)]" role="group" aria-label="リアクション">
      {REACTIONS.map((r) => (
        <button
          key={r.kind}
          type="button"
          onClick={() => onReact(r.kind)}
          className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
          aria-label={r.label}
        >
          <span className="flex h-[3.4rem] w-[3.4rem] items-center justify-center rounded-full border border-gold/35 bg-white/[0.04] text-[1.6rem] backdrop-blur-sm">
            {r.emoji}
          </span>
          <span className="text-[0.62rem] tracking-[0.2em] text-mist/70">{r.label}</span>
        </button>
      ))}
    </div>
  );
}
