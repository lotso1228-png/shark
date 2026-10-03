"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, type FormEvent } from "react";
import { Jp } from "../Jp";

export interface LettersInfo {
  id: string;
  to: string;
  page: number;
  pages: number;
  items: { from: string; text: string }[];
}

/** 1ページを表示する秒数（司会者側で自動で次へ） */
export const LETTER_PAGE_SECONDS = 9;

/**
 * 寄せ書きを流す：卒業生あての一言を3通ずつ、ゆっくり表示する。
 * 司会者の画面はタップ（または自動）で次のページへ。最後のページの次で閉じる。
 */
export function LettersOverlay({
  letters,
  onAdvance,
  audience = false,
}: {
  letters: LettersInfo | null;
  onAdvance?: () => void;
  audience?: boolean;
}) {
  // 司会者側：一定時間で自動的に次のページへ
  useEffect(() => {
    if (!letters || !onAdvance) return;
    const t = setTimeout(onAdvance, LETTER_PAGE_SECONDS * 1000);
    return () => clearTimeout(t);
  }, [letters?.id, letters?.page, onAdvance]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      {letters && (
        <motion.div
          key={letters.id}
          className={`fixed inset-x-0 top-0 z-[26] flex flex-col items-center justify-center bg-[#030407]/95 px-5 backdrop-blur-sm ${
            audience ? "bottom-[8.6rem]" : "bottom-0"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.6 } }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          onClick={onAdvance}
        >
          <p className="eyebrow text-[clamp(0.7rem,min(2.2vw,2vh),1.2rem)] text-gold">
            Messages<span className="font-mincho ml-3 tracking-[0.2em] text-mist/70">寄せ書き</span>
          </p>
          <p className="gold-text mt-[1.5vh] text-[clamp(1.6rem,min(7vw,7vh),4rem)] font-bold tracking-[0.1em]">
            {letters.to}へ
          </p>
          <AnimatePresence mode="wait">
            <motion.ul
              key={letters.page}
              className="mt-[3vh] flex w-full max-w-2xl flex-col gap-[2.2vh]"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] } }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.4 } }}
            >
              {letters.items.length === 0 && (
                <li className="text-center text-sm tracking-widest text-mist/70">まだ寄せ書きはありません</li>
              )}
              {letters.items.map((l, i) => (
                <motion.li
                  key={i}
                  className="border-l-2 border-gold/60 bg-white/[0.03] px-4 py-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.3 + i * 0.9, duration: 0.9 } }}
                >
                  <p className="text-[clamp(1.05rem,min(4.4vw,3.4vh),2rem)] leading-relaxed tracking-[0.04em] text-ivory [word-break:auto-phrase]">
                    <Jp>{l.text}</Jp>
                  </p>
                  <p className="mt-1 text-right text-[0.75rem] tracking-[0.2em] text-gold-soft/80">— {l.from}</p>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
          <p className="mt-[3vh] font-display text-sm tracking-[0.3em] text-mist/60 tabular-nums">
            {letters.page + 1} / {letters.pages}
          </p>
          {onAdvance && <p className="mt-1 text-[0.65rem] tracking-[0.3em] text-mist/40">タップで次へ</p>}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** 参加者：卒業生に寄せ書きを書く */
export function LetterComposer({
  open,
  grads,
  defaultFrom,
  onSend,
  onClose,
  max,
}: {
  open: boolean;
  grads: string[];
  defaultFrom: string;
  onSend: (to: string, text: string, from: string) => Promise<boolean>;
  onClose: () => void;
  max: number;
}) {
  const [to, setTo] = useState(grads[0] ?? "");
  const [text, setText] = useState("");
  const [from, setFrom] = useState(defaultFrom);
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  useEffect(() => {
    if (!to && grads[0]) setTo(grads[0]);
  }, [grads, to]);
  useEffect(() => setFrom((f) => f || defaultFrom), [defaultFrom]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!to || !text.trim() || state === "sending") return;
    setState("sending");
    const ok = await onSend(to, text, from.trim() || "匿名");
    setState(ok ? "sent" : "error");
    if (ok) setText("");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.form
            onSubmit={submit}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md border-t border-gold/30 bg-night px-6 pt-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:border"
            initial={{ y: 30 }}
            animate={{ y: 0 }}
            exit={{ y: 20 }}
          >
            <p className="eyebrow text-center text-xs text-gold">Messages</p>
            <h2 className="mt-2 text-center text-xl font-semibold tracking-[0.12em]">卒業生に寄せ書き</h2>
            <p className="mt-2 text-center text-xs leading-relaxed text-mist">
              <Jp>{"最後のメッセージの前に、みんなのスマホに流れます。"}</Jp>
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2" role="radiogroup" aria-label="あて先">
              {grads.map((g) => (
                <button
                  key={g}
                  type="button"
                  role="radio"
                  aria-checked={to === g}
                  onClick={() => setTo(g)}
                  className={`min-h-11 border px-4 text-sm tracking-wider ${
                    to === g ? "border-gold/80 bg-gold/15 text-gold-soft" : "border-ivory/15 text-ivory/80"
                  }`}
                >
                  {g}へ
                </button>
              ))}
            </div>
            <textarea
              id="letter-text"
              value={text}
              onChange={(e) => {
                setText(e.target.value.slice(0, max));
                if (state !== "sending") setState("idle");
              }}
              rows={3}
              maxLength={max}
              placeholder="ありがとう、の一言を"
              aria-label="寄せ書き"
              className="mt-4 w-full resize-none border border-ivory/15 bg-white/[0.04] px-4 py-3 text-base leading-relaxed text-ivory outline-none placeholder:text-mist/40 focus:border-gold/70"
            />
            <div className="mt-1 flex items-center justify-between text-xs text-mist/60">
              <label className="flex items-center gap-2">
                名前
                <input
                  id="letter-from"
                  value={from}
                  onChange={(e) => setFrom(e.target.value.slice(0, 16))}
                  placeholder="匿名"
                  className="min-h-9 w-28 border border-ivory/15 bg-white/[0.04] px-2 text-sm text-ivory outline-none focus:border-gold/70"
                />
              </label>
              <span className="tabular-nums">
                {text.length}/{max}
              </span>
            </div>
            <button
              type="submit"
              disabled={!text.trim() || !to || state === "sending"}
              className="eyebrow mt-4 min-h-14 w-full border border-gold/70 bg-gold/10 text-gold-soft disabled:opacity-30"
            >
              {state === "sending" ? "送信中…" : "送る"}
            </button>
            <p className="mt-2 min-h-5 text-center text-xs tracking-wider" aria-live="polite">
              {state === "sent" && <span className="text-gold-soft">送りました。続けて書けます</span>}
              {state === "error" && <span className="text-red-200/80"><Jp>{"送れませんでした。電波のよい場所でもう一度"}</Jp></span>}
            </p>
            <button type="button" onClick={onClose} className="mt-1 min-h-11 w-full text-sm tracking-widest text-mist/70">
              閉じる
            </button>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
