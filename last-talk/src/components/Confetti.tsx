"use client";

import { useEffect, useRef } from "react";

const COLORS = ["#e3cc9c", "#c9a96e", "#f4efe6", "#b8975c", "#efe2c4"];

interface Piece {
  x: number;
  y: number;
  w: number;
  h: number;
  vy: number;
  sway: number;
  phase: number;
  rot: number;
  vr: number;
  color: string;
  alpha: number;
}

/**
 * 品のある紙吹雪：ゴールドとアイボリーの細い紙片がゆっくり舞い落ちる。
 * Canvas + requestAnimationFrame で描画し、一定時間で自然に止む。
 */
export function Confetti({ duration = 14000 }: { duration?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const scale = Math.max(0.7, Math.min(1.8, w / 1200));
    const make = (initial: boolean): Piece => ({
      x: Math.random() * w,
      y: initial ? -Math.random() * h * 0.9 : -20,
      w: (4 + Math.random() * 5) * scale,
      h: (9 + Math.random() * 9) * scale,
      vy: (38 + Math.random() * 46) * scale,
      sway: 18 + Math.random() * 34,
      phase: Math.random() * Math.PI * 2,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 3.2,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      alpha: 0.55 + Math.random() * 0.4,
    });

    const count = Math.round(Math.min(160, (w * h) / 11000));
    const pieces: Piece[] = Array.from({ length: count }, () => make(true));
    const start = performance.now();
    let last = start;
    let raf = 0;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const elapsed = now - start;
      ctx.clearRect(0, 0, w, h);
      let alive = 0;
      for (const p of pieces) {
        p.y += p.vy * dt;
        p.phase += dt * 1.6;
        p.rot += p.vr * dt;
        if (p.y > h + 30) {
          if (elapsed < duration) Object.assign(p, make(false));
          else continue;
        }
        alive++;
        const x = p.x + Math.sin(p.phase) * p.sway;
        ctx.save();
        ctx.translate(x, p.y);
        ctx.rotate(p.rot);
        // 紙が回転して見えるよう幅を周期的に変化させる
        ctx.scale(Math.cos(p.phase * 1.7), 1);
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      }
      if (alive > 0) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [duration]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
