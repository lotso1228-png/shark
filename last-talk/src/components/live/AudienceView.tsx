"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { LivePayload } from "@/lib/live";
import type { LiveChannel, ReactionKind } from "@/lib/liveChannel";
import { ShuffleReveal, useRoulette, useShuffleOnce } from "../Shuffle";
import {
  ReactionBar,
  ReactionLayer,
  type ReactionLayerHandle,
} from "./Reactions";
import { JoinSheet, loadMe, type Me } from "./JoinSheet";
import { MemberPick } from "./MemberPick";
import { JudgeOverlay } from "./JudgeOverlay";
import { PenaltyOverlay, VoteOverlay } from "./DrinkOverlays";
import { LetterComposer, LettersOverlay } from "./Letters";
import { LETTER_MAX } from "@/lib/liveChannel";
import { AwardView } from "../AwardView";
import { Confetti } from "../Confetti";
import { FlowIndicator } from "../FlowIndicator";
import { Eyebrow, Hairline } from "../ui";
import { useFitText } from "../useFitText";
import { useWakeLock } from "../useWakeLock";

type Conn = "connecting" | "live" | "offline" | "signed-out";

const DARK = new Set(["last-intro", "last-question", "award", "finale"]);

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.3, ease: "easeIn" } },
} as const;

/**
 * 参加者画面：見るだけ。司会者が NEXT を押すと、この画面も同時に切り替わる。
 */
export function AudienceView({ channel }: { channel: LiveChannel | null }) {
  const [payload, setPayload] = useState<LivePayload | null>(null);
  const [conn, setConn] = useState<Conn>(channel ? "connecting" : "signed-out");
  const layer = useRef<ReactionLayerHandle>(null);
  useWakeLock();

  useEffect(() => {
    if (!channel) return;
    return channel.subscribe(
      setPayload,
      (s) => setConn(s === "error" ? "offline" : s),
      (r) => layer.current?.burst(r),
    );
  }, [channel]);

  const scene = payload?.scene ?? "idle";
  const canReact = !!channel?.react && conn !== "signed-out";

  // 名前を入れて参加（現役ルーレットの対象になる）
  const [me, setMe] = useState<Me | null>(null);
  const [askName, setAskName] = useState(false);
  const [writing, setWriting] = useState(false);
  // 寄せ書きが流れ始めたら、書きかけの画面は閉じて見てもらう
  const lettersId = payload?.letters?.id;
  useEffect(() => {
    if (lettersId) setWriting(false);
  }, [lettersId]);
  useEffect(() => {
    if (!channel?.join) return;
    const m = loadMe();
    setMe(m);
    if (m) channel.join(m.id, m.name);
    else setAskName(true);
  }, [channel]);
  const react = (k: ReactionKind) => {
    channel?.react?.(k);
    layer.current?.burst({ [k]: 1 });
    navigator.vibrate?.(8);
  };

  return (
    <main
      className={`stage relative h-dvh w-full overflow-hidden ${DARK.has(scene) ? "is-dark" : ""}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={payload?.key ?? `idle-${conn}`}
          className={`absolute inset-x-0 top-0 ${canReact ? "bottom-[8.6rem]" : "bottom-0"}`}
          {...fade}
        >
          {conn === "signed-out" ? (
            <Notice
              title="この画面で、お題を一緒に見られます"
              body="Claude にログインしてこのページを開き直すと、司会者が出したお題がここに表示されます。"
            />
          ) : (
            <Scene payload={payload} howTo={canReact} />
          )}
        </motion.div>
      </AnimatePresence>

      <MemberPick pick={payload?.pick ?? null} mine={!!me && payload?.pick?.memberId === me.id} />
      <JudgeOverlay judge={payload?.judge ?? null} audience={canReact} />
      <LettersOverlay letters={payload?.letters ?? null} audience={canReact} />
      {channel?.letter && (
        <LetterComposer
          open={writing}
          grads={payload?.grads ?? []}
          defaultFrom={me?.name ?? ""}
          max={LETTER_MAX}
          onSend={(to, text, from) => channel.letter!(to, text, from)}
          onClose={() => setWriting(false)}
        />
      )}
      {canReact && channel?.letter && (payload?.grads?.length ?? 0) > 0 && (
        <button
          type="button"
          onClick={() => setWriting(true)}
          className="fixed top-[max(0.5rem,env(safe-area-inset-top))] left-2 z-30 min-h-10 border border-gold/40 bg-ink/60 px-3 text-[0.7rem] tracking-[0.18em] text-gold-soft"
        >
          ✍ 寄せ書きを書く
        </button>
      )}
      <PenaltyOverlay penalty={payload?.penalty ?? null} audience={canReact} />
      <VoteOverlay
        vote={payload?.vote ?? null}
        audience={canReact}
        onVote={(c) => payload?.vote && channel?.vote?.(payload.vote.id, c)}
      />
      {channel?.join && (
        <JoinSheet
          key={me?.id ?? "new"}
          open={askName}
          current={me}
          onJoin={(m) => {
            setMe(m);
            setAskName(false);
            channel.join?.(m.id, m.name);
          }}
          onSkip={() => setAskName(false)}
        />
      )}
      {canReact && channel?.join && (
        <button
          type="button"
          onClick={() => setAskName(true)}
          className="fixed top-[max(0.5rem,env(safe-area-inset-top))] right-2 z-30 min-h-10 px-3 text-[0.65rem] tracking-[0.2em] text-mist/50"
        >
          {me ? `${me.name} で参加中` : "名前を入れて参加"}
        </button>
      )}
      {canReact && (
        <>
          <ReactionLayer ref={layer} bottom="9.4rem" />
          <div className="fixed inset-x-0 bottom-[calc(max(0.6rem,env(safe-area-inset-bottom))+1.4rem)] z-30">
            <ReactionBar onReact={react} />
          </div>
        </>
      )}
      <p
        className="pointer-events-none fixed bottom-[max(0.6rem,env(safe-area-inset-bottom))] left-0 z-10 flex w-full items-center justify-center gap-2 text-[0.65rem] tracking-[0.25em] text-ivory/35"
        aria-live="polite"
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            conn === "live"
              ? "bg-gold"
              : conn === "connecting"
                ? "bg-ivory/30"
                : "bg-red-300/60"
          }`}
        />
        {conn === "live" && "LIVE　司会者の画面と連動中"}
        {conn === "connecting" && "接続中…"}
        {conn === "offline" && "接続が切れました。再接続しています"}
        {conn === "signed-out" && "未接続"}
      </p>
    </main>
  );
}

function Notice({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 px-8 text-center">
      <h1 className="gold-text font-display text-[clamp(3rem,16vw,7rem)] leading-none font-light tracking-[0.06em]">
        LAST&nbsp;TALK
      </h1>
      <Hairline className="w-48" />
      <p className="text-lg tracking-[0.12em]">{title}</p>
      <p className="max-w-sm text-sm leading-relaxed text-mist/80">{body}</p>
    </div>
  );
}

function Scene({ payload, howTo = false }: { payload: LivePayload | null; howTo?: boolean }) {
  const p = payload;
  switch (p?.scene ?? "idle") {
    case "idle":
      return (
        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
          <Eyebrow>Graduation Night</Eyebrow>
          <h1 className="gold-text font-display mt-[3vh] text-[clamp(3.4rem,min(16vw,22vh),14rem)] leading-[0.9] font-light tracking-[0.06em]">
            LAST&nbsp;TALK
          </h1>
          <Hairline className="my-[4vh] w-[min(60vw,28rem)]" />
          <p className="text-[clamp(1rem,min(4.4vw,3.6vh),2.1rem)] leading-[2] tracking-[0.18em] text-ivory/90">
            卒業するその前に、
            <br />
            聞いておきたい話がある。
          </p>
          <p className="mt-[6vh] text-xs tracking-[0.3em] text-mist/60">
            まもなく始まります
          </p>
          {howTo && (
            <ul className="mt-[3vh] max-w-xs space-y-1.5 text-left text-[0.78rem] leading-relaxed text-ivory/75">
              <li>・司会者がお題を出すと、この画面にも表示されます</li>
              <li>・下のボタンで、話している卒業生に優勝ポイント</li>
              <li>・名前を入れると、現役ルーレットで指名されるかも</li>
            </ul>
          )}
        </div>
      );
    case "select":
      return <SelectScene p={p!} />;
    case "ready":
      return (
        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
          <Eyebrow>Next Speaker</Eyebrow>
          <p className="gold-text mt-[3vh] text-[clamp(2.6rem,min(13vw,15vh),10rem)] leading-tight font-bold tracking-[0.08em]">
            {p!.name}
          </p>
          <Hairline className="mt-[4vh] w-[min(50vw,22rem)]" />
        </div>
      );
    case "topic":
      return <TopicScene p={p!} />;
    case "last-intro":
      return (
        <div className="flex h-full flex-col items-center justify-center px-5 text-center">
          <p className="eyebrow gold-text font-display text-[clamp(1rem,min(4.4vw,3.8vh),2.4rem)] tracking-[0.5em]">
            Last Message
          </p>
          <Hairline className="my-[5vh] w-[min(56vw,30rem)]" />
          <h1 className="topic-text font-semibold">{p!.text}</h1>
          <p className="name-text mt-[5vh] tracking-[0.2em] text-gold-soft">
            {p!.name}
          </p>
        </div>
      );
    case "last-question":
      return <TopicScene p={p!} dark />;
    case "award":
      return <AwardView rows={p!.award?.rows ?? []} revealed={!!p!.award?.revealed} />;
    case "finale":
      return (
        <div className="relative h-full">
          <div className="absolute inset-0">
            <Confetti />
          </div>
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-5 text-center">
            <p className="eyebrow text-[clamp(0.75rem,min(2.6vw,2.4vh),1.5rem)] text-gold/80">
              Congratulations
            </p>
            <h1
              className="gold-text mt-[4vh] text-[clamp(2rem,min(8.4vw,12vh),9rem)] leading-[1.3] font-extrabold tracking-[0.1em]"
              style={{ wordBreak: "keep-all" }}
            >
              卒業
              <wbr />
              おめでとう
              <wbr />
              ございます
            </h1>
            <Hairline className="my-[5vh] w-[min(60vw,32rem)]" />
            <p className="text-[clamp(1.1rem,min(4.6vw,5.4vh),4.2rem)] font-semibold tracking-[0.2em] text-ivory/95">
              出会えたことに、ありがとう。
            </p>
            {p!.names.length > 0 && (
              <p className="mt-[6vh] max-w-5xl text-[clamp(0.8rem,min(3vw,2.6vh),1.6rem)] leading-loose tracking-[0.3em] text-mist/80">
                {p!.names.join("　·　")}
              </p>
            )}
            {!!p!.winners?.length && (
              <p className="mt-[2vh] text-[clamp(0.75rem,min(2.8vw,2.2vh),1.3rem)] tracking-[0.3em] text-gold/80">
                本日の優勝　{p!.winners.join("・")}
              </p>
            )}
          </div>
        </div>
      );
  }
}

function SelectScene({ p }: { p: LivePayload }) {
  const names = p.names ?? [];
  const winner = p.roulette ? names.indexOf(p.roulette.winner) : -1;
  const play = useShuffleOnce(
    `aud-roulette-${p.roulette?.id ?? ""}`,
    winner >= 0,
  );
  const spin = useRoulette(names.length, Math.max(winner, 0), play);
  return (
    <div className="flex h-full flex-col items-center justify-center gap-[4vh] px-6 text-center">
      <div>
        <Eyebrow>Who&apos;s next</Eyebrow>
        <p className="mt-4 text-[clamp(1.2rem,min(5vw,5vh),2.8rem)] tracking-[0.2em] text-ivory/90">
          {winner >= 0
            ? spin.done
              ? "決定！"
              : "ルーレット中…"
            : "次に話す卒業生は…"}
        </p>
      </div>
      {winner >= 0 && (
        <ul className="flex max-w-3xl flex-wrap justify-center gap-2">
          {names.map((n, i) => {
            const lit = spin.index === i;
            return (
              <li
                key={`${n}-${i}`}
                className={`border px-4 py-2 text-[clamp(1rem,4.4vw,1.6rem)] tracking-[0.1em] ${
                  lit && spin.done
                    ? "border-gold bg-gold/20 text-gold-soft shadow-[0_0_30px_rgba(201,169,110,0.4)]"
                    : lit
                      ? "border-gold/70 bg-gold/10 text-ivory"
                      : "border-ivory/10 text-mist/50"
                }`}
              >
                {n}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function TopicScene({ p, dark = false }: { p: LivePayload; dark?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useFitText(ref, [p.text]);
  const play = useShuffleOnce(`aud-${p.key}`, !dark && p.shuffle !== false);
  return (
    <div className="flex h-full flex-col px-5 pt-[max(1rem,env(safe-area-inset-top))] pb-12 sm:px-10">
      <header className="relative flex justify-center pt-[2vh] text-center">
        <p className="name-text font-semibold tracking-[0.16em] text-gold-soft">
          {p.name}
        </p>
        {!dark && (
          <div className="absolute top-[2vh] right-0 hidden sm:block">
            <FlowIndicator current={p.chapter} />
          </div>
        )}
      </header>
      <section className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
        <div
          ref={ref}
          className="flex w-full max-w-[min(92vw,1600px)] flex-col items-center py-2 text-center"
        >
          <ShuffleReveal
            play={play}
            cat={p.cat}
            text={p.text}
            special={p.special}
          >
            {dark ? (
              <Hairline className="mb-[5vh] w-[min(40vw,20rem)]" />
            ) : (
              <p
                className={`eyebrow mb-[3.5vh] text-[clamp(0.7rem,min(2.6vw,2vh),1.2rem)] ${
                  p.special ? "text-gold-soft" : "text-gold/80"
                }`}
              >
                {p.special && (
                  <span className="mr-3 inline-block align-middle text-[0.7em]">
                    ◆
                  </span>
                )}
                {p.label}
                <span className="font-mincho ml-3 tracking-[0.2em] text-mist/60">
                  {p.sub}
                </span>
              </p>
            )}
            <h1 className="topic-text">{p.text}</h1>
            {p.note && (
              <p className="mt-[4vh] text-[clamp(0.85rem,min(3.4vw,2.6vh),1.5rem)] tracking-[0.14em] text-mist/80">
                {p.note}
              </p>
            )}
          </ShuffleReveal>
        </div>
      </section>
    </div>
  );
}
