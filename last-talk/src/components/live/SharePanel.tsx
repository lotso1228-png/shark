"use client";

import { AnimatePresence, motion } from "framer-motion";
import qrcode from "qrcode-generator";
import { useMemo, useState } from "react";
import { useStore } from "../StoreProvider";
import { useLive } from "./LiveProvider";

const shareText = (url: string) =>
  [
    "【LAST TALK】参加用リンクです（アプリ・ログイン不要）",
    "① 開いて、名前を入れる",
    "② 話が良かったら 👏😂😭🔥 を押す",
    "③「寄せ書き」で、卒業生に一言送る",
    "リアクションが少ない話は、卒業生が一杯！",
    ...(url ? [url] : []),
  ].join("\n");

/** 参加者に配る QR コードとリンク。同時表示のオン／オフもここで切り替える */
export function SharePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { channel, status } = useLive();
  const { settings, actions } = useStore();
  const [copied, setCopied] = useState(false);
  const url = channel?.shareUrl ?? "";
  const on = !!settings.liveOn;

  const svg = useMemo(() => {
    if (!url) return "";
    const qr = qrcode(0, "M");
    qr.addData(url);
    qr.make();
    return qr.createSvgTag({ cellSize: 4, margin: 2, scalable: true });
  }, [url]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const el = document.getElementById("share-url") as HTMLInputElement | null;
      el?.select();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          data-modal-open
          className="fixed inset-0 z-[55] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="参加者に共有"
            className="scroll-thin max-h-[92dvh] w-full max-w-md overflow-y-auto border border-gold/30 bg-night px-6 py-7 text-center"
            initial={{ y: 16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <p className="eyebrow text-xs text-gold">Share</p>
            <h2 className="mt-3 text-xl font-semibold tracking-[0.12em]">参加者のスマホに同時表示</h2>
            <p className="mt-3 text-sm leading-relaxed text-mist">
              QRコードを読み取ると、司会者が出したお題が参加者のスマホにも表示されます。ログインやアプリは不要です。
            </p>

            {!url ? (
              <p className="mt-6 text-sm text-red-200/80">
                このブラウザでは同時表示を使えません。最新の Safari / Chrome で開いてください。
              </p>
            ) : (
              <>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  onClick={() => actions.setLiveOn(!on)}
                  className={`mt-6 flex min-h-14 w-full items-center justify-between border px-5 text-left transition-colors ${
                    on ? "border-gold/70 bg-gold/10" : "border-ivory/15"
                  }`}
                >
                  <span className="flex flex-col">
                    <span className="tracking-wider">同時表示</span>
                    <span className="text-xs text-mist/70">
                      {!on && "オフ（参加者の画面は止まったまま）"}
                      {on && status === "live" && "配信中"}
                      {on && status === "connecting" && "接続中…"}
                      {on && status === "error" && "送信に失敗したため、自動で再送しています…"}
                    </span>
                  </span>
                  <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${on ? "bg-gold/80" : "bg-ivory/15"}`}>
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-ivory transition-transform ${on ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </span>
                </button>

                <div
                  className={`mx-auto mt-6 w-full max-w-[18rem] bg-[#f4efe6] p-3 transition-opacity ${on ? "" : "opacity-40"}`}
                  aria-label="参加者用QRコード"
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
                {!on && <p className="mt-3 text-xs text-gold/80">同時表示をオンにしてから読み取ってもらってください</p>}

                <div className="mt-5 flex gap-2">
                  <input
                    id="share-url"
                    readOnly
                    value={url}
                    onFocus={(e) => e.currentTarget.select()}
                    className="min-h-11 min-w-0 flex-1 border border-ivory/15 bg-white/[0.03] px-3 text-xs text-mist outline-none"
                    aria-label="参加者用リンク"
                  />
                  <button
                    type="button"
                    onClick={copy}
                    className="min-h-11 shrink-0 border border-gold/60 px-4 text-sm tracking-wider text-gold-soft"
                  >
                    {copied ? "コピー済み" : "コピー"}
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <a
                    href={`https://line.me/R/share?text=${encodeURIComponent(shareText(url))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-12 items-center justify-center bg-[#06c755] text-sm font-semibold tracking-wider text-white"
                  >
                    LINEで送る
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      navigator.share
                        ? navigator.share({ title: "LAST TALK", text: shareText(""), url }).catch(() => {})
                        : copy()
                    }
                    className="min-h-12 border border-ivory/20 text-sm tracking-wider text-ivory/90"
                  >
                    ほかのアプリで送る
                  </button>
                </div>
                <p className="mt-4 text-left text-[0.7rem] leading-relaxed text-mist/60">
                  ・リンクは LINE などで送っても使えます。同じリンクは何度でも使えます。
                  <br />
                  ・<strong className="text-gold-soft">司会者のスマホは Wi-Fi をオフにして、モバイル回線（4G/5G）で使ってください。</strong>会場の Wi-Fi に参加者が大勢つながっても、お題の配信が止まらなくなります。
                </p>
              </>
            )}

            <button
              type="button"
              autoFocus
              onClick={onClose}
              className="mt-6 min-h-11 px-6 text-sm tracking-widest text-mist hover:text-ivory"
            >
              閉じる
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
