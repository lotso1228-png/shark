"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type FormEvent } from "react";

const KEY = "lasttalk:v1:me";

export interface Me {
  id: string;
  name: string;
}

export function loadMe(): Me | null {
  try {
    const raw = localStorage.getItem(KEY);
    const m = raw ? (JSON.parse(raw) as Me) : null;
    return m && /^[a-z0-9]{4,24}$/.test(m.id) && m.name ? m : null;
  } catch {
    return null;
  }
}

function saveMe(m: Me) {
  try {
    localStorage.setItem(KEY, JSON.stringify(m));
  } catch {
    /* 保存できなくても今回の参加は有効 */
  }
}

/** 参加者が名前を入れて参加する（現役ルーレットの対象になる）。入れずに見るだけでもよい */
export function JoinSheet({
  open,
  current,
  onJoin,
  onSkip,
}: {
  open: boolean;
  current: Me | null;
  onJoin: (m: Me) => void;
  onSkip: () => void;
}) {
  const [name, setName] = useState(current?.name ?? "");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const n = name.trim().slice(0, 16);
    if (!n) return;
    const m = { id: current?.id ?? Math.random().toString(36).slice(2, 12), name: n };
    saveMe(m);
    onJoin(m);
  };
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.form
            onSubmit={submit}
            className="w-full max-w-md border-t border-gold/30 bg-night px-6 pt-7 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-center sm:border"
            initial={{ y: 30 }}
            animate={{ y: 0 }}
            exit={{ y: 20 }}
          >
            <p className="eyebrow text-xs text-gold">Join</p>
            <h2 className="mt-3 text-xl font-semibold tracking-[0.12em]">お名前を教えてください</h2>
            <p className="mt-3 text-sm leading-relaxed text-mist">
              現役ルーレットで指名されるかもしれません。呼ばれたら、このスマホが震えてお知らせします。
            </p>
            <input
              id="join-name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={16}
              placeholder="例：佐藤（呼ばれたい名前）"
              className="mt-6 min-h-12 w-full border border-ivory/15 bg-white/[0.04] px-4 text-center text-lg text-ivory outline-none placeholder:text-mist/40 focus:border-gold/70"
              aria-label="お名前"
            />
            <button
              type="submit"
              disabled={!name.trim()}
              className="eyebrow mt-4 min-h-14 w-full border border-gold/70 bg-gold/10 text-gold-soft disabled:opacity-30"
            >
              参加する
            </button>
            <button type="button" onClick={onSkip} className="mt-3 min-h-11 px-4 text-sm tracking-widest text-mist/70">
              名前を入れずに見る
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
