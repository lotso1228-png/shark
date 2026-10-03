"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Jp } from "../Jp";

export interface JudgeInfo {
  id: string;
  seconds: number;
  target: number;
  result?: "safe" | "out";
  count?: number;
}

/** 残り秒数。司会者は終了時刻から、参加者は受け取った瞬間からの経過で数える */
function useRemaining(id: string, seconds: number, endsAt?: number) {
  const [start] = useState(() => Date.now());
  const end = endsAt ?? start + seconds * 1000;
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(t);
  }, [id]);
  return Math.max(0, Math.ceil((end - now) / 1000));
}

/**
 * 判定タイム：受付時間内のリアクションが目標に届かなければ「一杯どうぞ」。
 * 司会者の画面では途中の数も見せる。参加者の画面は下のリアクションボタンを隠さない。
 */
export function JudgeOverlay({
  judge,
  endsAt,
  liveCount,
  onClose,
  audience = false,
}: {
  judge: JudgeInfo | null;
  endsAt?: number;
  liveCount?: number;
  onClose?: () => void;
  audience?: boolean;
}) {
  return (
    <AnimatePresence>
      {judge && (
        <motion.div
          key={judge.id}
          className={`fixed inset-x-0 top-0 z-[25] flex items-center justify-center bg-ink/90 px-6 backdrop-blur-sm ${
            audience ? "bottom-[8.6rem]" : "bottom-0"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.3 } }}
          exit={{ opacity: 0, transition: { duration: 0.3 } }}
          onClick={judge.result ? onClose : undefined}
        >
          <Body judge={judge} endsAt={endsAt} liveCount={liveCount} audience={audience} closable={!!onClose} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Body({
  judge,
  endsAt,
  liveCount,
  audience,
  closable,
}: {
  judge: JudgeInfo;
  endsAt?: number;
  liveCount?: number;
  audience: boolean;
  closable: boolean;
}) {
  const remaining = useRemaining(judge.id, judge.seconds, endsAt);
  const big = "text-[clamp(2.6rem,min(12vw,15vh),9rem)] leading-tight font-extrabold tracking-[0.08em]";

  useEffect(() => {
    if (judge.result === "out" && audience) navigator.vibrate?.([200, 100, 200]);
  }, [judge.result, audience]);

  if (judge.result) {
    const safe = judge.result === "safe";
    return (
      <motion.div
        className="flex flex-col items-center text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
      >
        <p className="eyebrow text-[clamp(0.75rem,min(2.4vw,2.2vh),1.3rem)] text-gold">Judge</p>
        <p className={`mt-[3vh] ${big} ${safe ? "gold-text" : "text-ivory"}`}>{safe ? "セーフ！" : "アウト！"}</p>
        <p className="mt-[2vh] text-[clamp(1.2rem,min(5vw,5vh),3rem)] font-semibold tracking-[0.12em] text-ivory/95">
          {safe ? "会場が救いました 👏" : "一杯どうぞ 🍺"}
        </p>
        <p className="mt-[2vh] text-[clamp(0.85rem,min(3vw,2.4vh),1.4rem)] tracking-[0.16em] text-mist/80 tabular-nums">
          リアクション {judge.count ?? 0} ／ 目標 {judge.target}
        </p>
        {!safe && <p className="mt-2 text-xs tracking-[0.2em] text-mist/60"><Jp>{"ソフトドリンクでもOK。無理はしないでください"}</Jp></p>}
        {closable && <p className="mt-[4vh] text-xs tracking-[0.3em] text-mist/50">タップで閉じる</p>}
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">
      <p className="eyebrow text-[clamp(0.75rem,min(2.4vw,2.2vh),1.3rem)] text-gold">Judge</p>
      <p className={`mt-[2vh] ${big} gold-text`}>判定タイム！</p>
      <p className="mt-[2vh] max-w-2xl text-[clamp(0.95rem,min(3.6vw,3vh),1.8rem)] leading-relaxed tracking-[0.1em] text-ivory/90">
        <Jp>{`リアクションが ${judge.target} に届かなければ…一杯！`}</Jp>
      </p>
      <motion.p
        key={remaining}
        className="mt-[3vh] font-display text-[clamp(3rem,min(16vw,18vh),10rem)] leading-none text-gold-soft tabular-nums"
        initial={{ scale: 1.25, opacity: 0.4 }}
        animate={{ scale: 1, opacity: 1, transition: { duration: 0.35 } }}
      >
        {remaining > 0 ? remaining : "…"}
      </motion.p>
      <p className="mt-[2vh] text-[clamp(0.9rem,min(3.4vw,2.6vh),1.5rem)] tracking-[0.18em] text-mist/80 tabular-nums">
        {remaining > 0
          ? audience
            ? "下のボタンを連打で救え！"
            : `いま ${liveCount ?? 0} ／ 目標 ${judge.target}`
          : "集計中…"}
      </p>
    </div>
  );
}
