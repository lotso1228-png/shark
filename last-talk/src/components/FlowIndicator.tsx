"use client";

import { CATEGORY_META, CATEGORY_ORDER } from "@/lib/topics";
import type { Category } from "@/lib/types";

/** 笑い → 思い出 → 仲間 → LAST MESSAGE の現在地を控えめに示す */
export function FlowIndicator({ current, className = "" }: { current: Category; className?: string }) {
  const idx = CATEGORY_ORDER.indexOf(current);
  return (
    <ol className={`flex items-center gap-2 ${className}`} aria-label="進行">
      {CATEGORY_ORDER.map((c, i) => (
        <li key={c} className="flex items-center gap-2">
          <span
            aria-current={i === idx ? "step" : undefined}
            className={`block h-[3px] rounded-full transition-all duration-700 ${
              i === idx ? "w-8 bg-gold" : i < idx ? "w-3 bg-gold/50" : "w-3 bg-ivory/15"
            }`}
            title={CATEGORY_META[c].label}
          />
        </li>
      ))}
    </ol>
  );
}
