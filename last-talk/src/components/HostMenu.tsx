"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import { CATEGORY_META, CATEGORY_ORDER, SPECIAL_META } from "@/lib/topics";
import type { Mood, SpecialKind } from "@/lib/types";
import { useLiveStatus, useOpenShare } from "./live/LiveProvider";
import { useStore } from "./StoreProvider";
import type { Fullscreen } from "./useFullscreen";

const MOODS: { id: Mood; label: string }[] = [
  { id: "normal", label: "通常" },
  { id: "hype", label: "盛り上がり" },
  { id: "calm", label: "しっとり" },
];

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-t border-ivory/10 py-4 first:border-t-0 first:pt-0">
      <h3 className="mb-3 text-[0.7rem] tracking-[0.3em] text-mist/60">{title}</h3>
      {children}
    </section>
  );
}

function Chip({
  active,
  onClick,
  children,
  disabled,
}: {
  active?: boolean;
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={`min-h-11 border px-3 py-2 text-sm tracking-wider transition-colors disabled:opacity-30 ${
        active
          ? "border-gold/80 bg-gold/15 text-gold-soft"
          : "border-ivory/15 text-ivory/85 hover:border-gold/50"
      }`}
    >
      {children}
    </button>
  );
}

function Action({
  onClick,
  children,
  disabled,
  tone = "normal",
}: {
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
  tone?: "normal" | "gold" | "danger";
}) {
  const color =
    tone === "gold"
      ? "border-gold/60 text-gold-soft"
      : tone === "danger"
        ? "border-red-300/20 text-red-200/80"
        : "border-ivory/15 text-ivory/90";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`min-h-12 w-full border px-3 py-3 text-left text-[0.9rem] tracking-wider whitespace-nowrap sm:px-4 transition-colors hover:bg-white/[0.04] disabled:opacity-30 ${color}`}
    >
      {children}
    </button>
  );
}

/**
 * 司会メニュー：画面右下の小さなボタンから開く。
 * 参加者の目に入りにくいよう、閉じている間はごく控えめに表示する。
 */
export function HostMenu({
  open,
  onOpenChange,
  fullscreen,
  onRestart,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  fullscreen: Fullscreen;
  onRestart: () => void;
}) {
  const { game, settings, members, actions } = useStore();
  const inGame = !!game.graduateId && ["topic", "ready"].includes(game.screen);
  const onTopic = game.screen === "topic" && game.cursor >= 0;
  const run = (fn: () => void) => () => {
    fn();
    onOpenChange(false);
  };
  const moodLabel = MOODS.find((m) => m.id === settings.mood)?.label;
  const live = useLiveStatus();
  const openShare = useOpenShare();

  return (
    <>
      <button
        type="button"
        onClick={() => onOpenChange(true)}
        aria-label="司会メニューを開く"
        className="fixed right-2 bottom-[max(0.5rem,env(safe-area-inset-bottom))] z-30 flex min-h-11 items-center gap-2 px-3 text-[0.65rem] tracking-[0.3em] text-ivory/25 transition-colors hover:text-gold-soft"
      >
        <svg width="14" height="10" viewBox="0 0 14 10" aria-hidden>
          <path d="M0 1h14M0 5h14M0 9h14" stroke="currentColor" strokeWidth="1" />
        </svg>
        <span className="hidden sm:inline">司会メニュー</span>
        {settings.mood !== "normal" && <span className="text-gold/50">· {moodLabel}</span>}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            data-modal-open
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-[2px] sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => onOpenChange(false)}
            onKeyDown={(e) => {
              if (e.key === "Escape" || e.key.toLowerCase() === "h") onOpenChange(false);
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="司会メニュー"
              className="scroll-thin max-h-[88dvh] w-full overflow-y-auto border-t border-gold/25 bg-night/95 px-5 pt-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:max-w-xl sm:border sm:px-7"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } }}
              exit={{ y: 30, opacity: 0, transition: { duration: 0.2 } }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="eyebrow text-xs text-gold">Host Menu</p>
                  {live !== "off" && (
                    <p className="flex items-center gap-2 text-[0.7rem] tracking-wider text-mist/80">
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          live === "live" ? "bg-gold" : live === "error" ? "bg-red-300/70" : "bg-ivory/30"
                        }`}
                      />
                      {live === "live" && "参加者のスマホにも同時表示中"}
                      {live === "connecting" && "同時表示に接続中…"}
                      {live === "error" && "同時表示を再送しています…"}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  autoFocus
                  onClick={() => onOpenChange(false)}
                  className="min-h-11 px-3 text-sm tracking-widest text-mist hover:text-ivory"
                >
                  閉じる ✕
                </button>
              </div>

              <Section title="進行">
                <div className="grid grid-cols-3 gap-2">
                  <Action onClick={run(game.screen === "ready" ? actions.draw : actions.next)} disabled={!inGame} tone="gold">
                    次のお題
                  </Action>
                  <Action onClick={run(actions.skip)} disabled={!onTopic}>
                    スキップ
                  </Action>
                  <Action onClick={run(actions.back)} disabled={!onTopic}>
                    ひとつ戻る
                  </Action>
                </div>
              </Section>

              <Section title={`カテゴリー変更${game.chapterLocked ? "（固定中）" : "（自動で進行中）"}`}>
                <div className="flex flex-wrap gap-2">
                  <Chip active={!game.chapterLocked} onClick={run(() => actions.changeCategory("auto"))}>
                    自動
                  </Chip>
                  {CATEGORY_ORDER.map((c) => (
                    <Chip
                      key={c}
                      active={game.chapterLocked && game.chapter === c}
                      onClick={run(() => actions.changeCategory(c))}
                    >
                      {CATEGORY_META[c].label}
                    </Chip>
                  ))}
                </div>
              </Section>

              <Section title={`現役メンバー（${members.length}人）`}>
                <Action onClick={run(actions.pickMember)} disabled={members.length === 0}>
                  {members.length === 0 ? "まだいません（QR参加・設定で追加）" : "現役をランダム指名"}
                </Action>
              </Section>

              <Section title="特別カード">
                <div className="flex flex-wrap gap-2">
                  {(["random", "toast", "nominate", "reverse", "everyone", "photo"] as const).map((k) => (
                    <Chip key={k} disabled={!inGame} onClick={run(() => actions.special(k as SpecialKind | "random"))}>
                      {k === "random" ? "ランダム" : SPECIAL_META[k].label}
                    </Chip>
                  ))}
                </div>
              </Section>

              <Section title="モード">
                <div className="flex flex-wrap gap-2">
                  {MOODS.map((m) => (
                    <Chip key={m.id} active={settings.mood === m.id} onClick={() => actions.setMood(m.id)}>
                      {m.label}
                    </Chip>
                  ))}
                  <span className="mx-1 w-px self-stretch bg-ivory/10" />
                  <Chip active={settings.venueMode} onClick={actions.toggleVenue}>
                    会場モード
                  </Chip>
                  <Chip active={settings.shuffleFx !== false} onClick={actions.toggleShuffle}>
                    シャッフル演出
                  </Chip>
                  <Chip active={settings.rotate !== false} onClick={actions.toggleRotate}>
                    1問ごとに交代
                  </Chip>
                  {fullscreen.supported && (
                    <Chip active={fullscreen.active} onClick={fullscreen.toggle}>
                      全画面
                    </Chip>
                  )}
                </div>
              </Section>

              <Section title="移動">
                <div className="grid grid-cols-2 gap-2">
                  <Action onClick={run(() => actions.goTo("select"))}>卒業生を変える</Action>
                  <Action onClick={run(actions.enterLast)} tone="gold" disabled={game.screen.startsWith("last") || game.screen === "finale"}>
                    LAST MESSAGE へ
                  </Action>
                  <Action onClick={run(() => actions.goTo("setup"))}>卒業生・お題の設定</Action>
                  {openShare && (
                    <Action onClick={run(openShare)} tone="gold">
                      参加者に共有（QR）
                    </Action>
                  )}
                  <Action onClick={onRestart} tone="danger">
                    最初に戻る
                  </Action>
                </div>
              </Section>

              <p className="mt-2 hidden text-[0.7rem] leading-relaxed tracking-wider text-mist/50 sm:block">
                キーボード：→ / Space 次へ　← 戻る　S スキップ　F 全画面　V 会場モード　H 司会メニュー
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
