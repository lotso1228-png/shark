"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { CATEGORY_META, TOPIC_CATEGORIES } from "@/lib/topics";
import type { Category, Graduate, Mood, Topic } from "@/lib/types";
import { useConfirm } from "../Confirm";
import { MAX_GRADUATES, useStore } from "../StoreProvider";
import { Button } from "../ui";

type Tab = "graduates" | "topics" | "display";

const TABS: { id: Tab; label: string }[] = [
  { id: "graduates", label: "卒業生登録" },
  { id: "topics", label: "お題管理" },
  { id: "display", label: "表示・モード" },
];

const input =
  "min-h-12 w-full border border-ivory/15 bg-white/[0.03] px-4 py-3 text-base text-ivory placeholder:text-mist/40 outline-none transition-colors focus:border-gold/70";

const smallBtn =
  "min-h-10 min-w-10 px-3 text-sm tracking-wider text-mist/80 transition-colors hover:text-gold-soft disabled:opacity-25";

export function SetupScreen() {
  const { actions, graduates } = useStore();
  const [tab, setTab] = useState<Tab>("graduates");

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-ivory/10 px-4 py-3 sm:px-8">
        <button type="button" onClick={actions.closeSetup} className={`${smallBtn} !px-1`}>
          ← 戻る
        </button>
        <p className="eyebrow text-xs text-gold">Setup</p>
        <span className="w-16" />
      </header>

      <nav className="flex justify-center gap-1 border-b border-ivory/10 px-2" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`min-h-12 border-b px-4 text-sm tracking-[0.15em] transition-colors sm:px-6 ${
              tab === t.id ? "border-gold text-gold-soft" : "border-transparent text-mist/70 hover:text-ivory"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="scroll-thin flex-1 overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl px-5 py-8 pb-24">
          {tab === "graduates" && <GraduatesTab />}
          {tab === "topics" && <TopicsTab />}
          {tab === "display" && <DisplayTab />}
        </div>
      </div>

      {tab === "graduates" && graduates.length > 0 && (
        <div className="border-t border-ivory/10 bg-ink/80 px-4 py-3 text-center safe-bottom backdrop-blur">
          <Button onClick={actions.start} className="!min-h-12">
            この卒業生で Start
          </Button>
        </div>
      )}
    </div>
  );
}

function Heading({ title, note }: { title: string; note?: ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold tracking-[0.2em]">{title}</h2>
      {note && <p className="mt-2 text-sm leading-relaxed text-mist/80">{note}</p>}
    </div>
  );
}

/* ───────── 卒業生 ───────── */

function GraduatesTab() {
  const { graduates, actions } = useStore();
  const confirm = useConfirm();
  const [name, setName] = useState("");
  const [nickname, setNickname] = useState("");
  const full = graduates.length >= MAX_GRADUATES;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() && !nickname.trim()) return;
    actions.addGraduate(name, nickname);
    setName("");
    setNickname("");
    (document.getElementById("grad-name") as HTMLInputElement | null)?.focus();
  };

  return (
    <>
      <Heading
        title="卒業生"
        note={`最大${MAX_GRADUATES}名。画面には「呼び名」が大きく表示されます（空欄なら名前）。`}
      />
      <form onSubmit={submit} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <label className="block">
          <span className="mb-1 block text-xs tracking-widest text-mist/70">名前</span>
          <input
            id="grad-name"
            className={input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="山田太郎"
            maxLength={30}
            disabled={full}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs tracking-widest text-mist/70">呼び名</span>
          <input
            className={input}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="山田さん"
            maxLength={20}
            disabled={full}
          />
        </label>
        <div className="flex items-end">
          <Button
            variant="ghost"
            className="!min-h-12 w-full !border-gold/60 !text-gold-soft"
            onClick={submit}
            disabled={full || (!name.trim() && !nickname.trim())}
          >
            追加
          </Button>
        </div>
      </form>
      {full && <p className="mt-3 text-sm text-gold/80">登録できるのは{MAX_GRADUATES}名までです。</p>}

      <ul className="mt-8 divide-y divide-ivory/10 border-y border-ivory/10">
        {graduates.length === 0 && (
          <li className="py-10 text-center text-sm text-mist/60">まだ登録されていません</li>
        )}
        {graduates.map((g, i) => (
          <GraduateRow
            key={g.id}
            g={g}
            index={i}
            total={graduates.length}
            onRemove={() =>
              confirm({
                title: `${g.nickname || g.name} を削除しますか？`,
                ok: "削除",
                onOk: () => actions.removeGraduate(g.id),
              })
            }
          />
        ))}
      </ul>

      <MembersSection />
    </>
  );
}

/* ───────── 現役メンバー ───────── */

function MembersSection() {
  const { members, actions } = useStore();
  const [name, setName] = useState("");
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    actions.addMember(name);
    setName("");
  };
  return (
    <div className="mt-14">
      <Heading
        title={`現役メンバー（${members.length}人）`}
        note="「現役をランダム指名」の対象です。参加者がQRコードから名前を入れて参加すると、自動でここに追加されます。手入力も可能です。"
      />
      <form onSubmit={submit} className="flex gap-2">
        <input
          id="member-name"
          className={input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例：佐藤"
          maxLength={16}
          aria-label="現役メンバーの名前"
        />
        <Button
          variant="ghost"
          className="!min-h-12 shrink-0 !border-gold/60 !text-gold-soft"
          onClick={submit}
          disabled={!name.trim()}
        >
          追加
        </Button>
      </form>
      {members.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {members.map((m) => (
            <li key={m.id} className="flex items-center gap-1 border border-ivory/15 py-1 pr-1 pl-3 text-sm">
              <span>{m.name}</span>
              {m.joined && <span className="text-[0.6rem] tracking-widest text-gold/70">QR</span>}
              <button
                type="button"
                onClick={() => actions.removeMember(m.id)}
                className="min-h-8 min-w-8 text-mist/60 hover:text-red-200"
                aria-label={`${m.name}を削除`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function GraduateRow({
  g,
  index,
  total,
  onRemove,
}: {
  g: Graduate;
  index: number;
  total: number;
  onRemove: () => void;
}) {
  const { actions } = useStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(g.name);
  const [nickname, setNickname] = useState(g.nickname);

  if (editing) {
    return (
      <li className="grid gap-2 py-4 sm:grid-cols-[1fr_1fr_auto]">
        <input className={input} value={name} onChange={(e) => setName(e.target.value)} aria-label="名前" />
        <input
          className={input}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          aria-label="呼び名"
        />
        <div className="flex gap-1">
          <button
            type="button"
            className={`${smallBtn} text-gold-soft`}
            onClick={() => {
              actions.updateGraduate(g.id, { name: name.trim(), nickname: nickname.trim() });
              setEditing(false);
            }}
          >
            保存
          </button>
          <button type="button" className={smallBtn} onClick={() => setEditing(false)}>
            取消
          </button>
        </div>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-3 py-3">
      <span className="font-display w-7 text-sm text-mist/40">{String(index + 1).padStart(2, "0")}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-lg tracking-wider">{g.nickname || g.name}</span>
        {g.nickname && g.name && <span className="block truncate text-xs text-mist/60">{g.name}</span>}
      </span>
      <span className="flex shrink-0 items-center">
        <button type="button" className={smallBtn} onClick={() => actions.moveGraduate(g.id, -1)} disabled={index === 0} aria-label="上へ">
          ↑
        </button>
        <button
          type="button"
          className={smallBtn}
          onClick={() => actions.moveGraduate(g.id, 1)}
          disabled={index === total - 1}
          aria-label="下へ"
        >
          ↓
        </button>
        <button type="button" className={smallBtn} onClick={() => setEditing(true)}>
          編集
        </button>
        <button type="button" className={`${smallBtn} hover:!text-red-200`} onClick={onRemove}>
          削除
        </button>
      </span>
    </li>
  );
}

/* ───────── お題 ───────── */

function TopicsTab() {
  const { topics, actions } = useStore();
  const confirm = useConfirm();
  const [cat, setCat] = useState<Category>("laugh");
  const [text, setText] = useState("");
  const list = topics.filter((t) => t.category === cat);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    actions.addTopic(cat, text);
    setText("");
  };

  return (
    <>
      <Heading
        title="お題管理"
        note="笑い → 思い出 → 仲間 → LAST MESSAGE の順に自動で進行します。各カテゴリーにお題を追加・編集・削除できます。"
      />
      <div className="mb-6 flex flex-wrap gap-2">
        {TOPIC_CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            aria-pressed={cat === c}
            className={`min-h-11 border px-4 text-sm tracking-wider transition-colors ${
              cat === c ? "border-gold/80 bg-gold/10 text-gold-soft" : "border-ivory/15 text-ivory/80 hover:border-gold/50"
            }`}
          >
            {CATEGORY_META[c].label}
            <span className="ml-2 text-xs text-mist/60">{topics.filter((t) => t.category === c).length}</span>
          </button>
        ))}
      </div>
      <p className="mb-4 text-xs tracking-wider text-mist/60">{CATEGORY_META[cat].note}</p>

      <form onSubmit={submit} className="flex gap-2">
        <input
          className={input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`「${CATEGORY_META[cat].label}」に新しいお題を追加`}
          maxLength={60}
          aria-label="新しいお題"
        />
        <Button
          variant="ghost"
          className="!min-h-12 shrink-0 !border-gold/60 !text-gold-soft"
          onClick={submit}
          disabled={!text.trim()}
        >
          追加
        </Button>
      </form>

      <ul className="mt-6 divide-y divide-ivory/10 border-y border-ivory/10">
        {list.length === 0 && (
          <li className="py-8 text-center text-sm text-mist/60">
            お題がありません（このカテゴリーは出題されません）
          </li>
        )}
        {list.map((t) => (
          <TopicRow
            key={t.id}
            t={t}
            onRemove={() =>
              confirm({ title: "このお題を削除しますか？", body: t.text, ok: "削除", onOk: () => actions.removeTopic(t.id) })
            }
          />
        ))}
      </ul>

      <div className="mt-8 text-center">
        <button
          type="button"
          className={smallBtn}
          onClick={() =>
            confirm({
              title: "標準お題に戻しますか？",
              body: "削除した標準のお題を元に戻します。自分で追加・編集したお題はそのまま残ります。",
              ok: "標準に戻す",
              onOk: actions.restoreDefaultTopics,
            })
          }
        >
          標準お題に戻す
        </button>
      </div>
    </>
  );
}

function TopicRow({ t, onRemove }: { t: Topic; onRemove: () => void }) {
  const { actions } = useStore();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(t.text);

  if (editing) {
    return (
      <li className="flex gap-2 py-3">
        <input className={input} value={text} onChange={(e) => setText(e.target.value)} autoFocus aria-label="お題" />
        <button
          type="button"
          className={`${smallBtn} text-gold-soft`}
          disabled={!text.trim()}
          onClick={() => {
            actions.updateTopic(t.id, text);
            setEditing(false);
          }}
        >
          保存
        </button>
        <button type="button" className={smallBtn} onClick={() => (setText(t.text), setEditing(false))}>
          取消
        </button>
      </li>
    );
  }
  return (
    <li className="flex items-center gap-3 py-3">
      <span className="min-w-0 flex-1 leading-relaxed">
        {t.text}
        {!t.builtIn && (
          <span className="ml-2 text-[0.65rem] tracking-widest text-gold/70">{t.edited ? "編集済" : "追加"}</span>
        )}
      </span>
      <span className="flex shrink-0">
        <button type="button" className={smallBtn} onClick={() => setEditing(true)}>
          編集
        </button>
        <button type="button" className={`${smallBtn} hover:!text-red-200`} onClick={onRemove}>
          削除
        </button>
      </span>
    </li>
  );
}

/* ───────── 表示・モード ───────── */

const MOOD_INFO: { id: Mood; label: string; note: string }[] = [
  { id: "normal", label: "通常", note: "笑い → 思い出 → 仲間 の流れどおりに出題" },
  { id: "hype", label: "盛り上がり", note: "笑い・指名・暴露系のお題を優先。特別カードも少し出やすく" },
  { id: "calm", label: "しっとり", note: "思い出・感謝系のお題を優先。写真カードが出やすく" },
];

function DisplayTab() {
  const { settings, actions } = useStore();
  return (
    <>
      <Heading title="会場モード" note="プロジェクター・大型スクリーン向け。お題の文字をさらに大きくし、操作ボタンを最小限にします。" />
      <button
        type="button"
        role="switch"
        aria-checked={settings.venueMode}
        onClick={actions.toggleVenue}
        className="flex min-h-14 w-full items-center justify-between border border-ivory/15 px-5 text-left"
      >
        <span className="tracking-wider">会場モード</span>
        <span className={`relative h-6 w-11 rounded-full transition-colors ${settings.venueMode ? "bg-gold/80" : "bg-ivory/15"}`}>
          <span
            className={`absolute top-1 h-4 w-4 rounded-full bg-ivory transition-transform ${settings.venueMode ? "translate-x-6" : "translate-x-1"}`}
          />
        </span>
      </button>

      <div className="mt-12">
        <Heading
          title="1問ごとに交代"
          note="NEXT を押すたびに、話す卒業生が自動で次の人に替わります（話した回数が少ない人から順に）。オフにすると同じ人に続けて聞けます。"
        />
        <button
          type="button"
          role="switch"
          aria-checked={settings.rotate !== false}
          onClick={actions.toggleRotate}
          className="flex min-h-14 w-full items-center justify-between border border-ivory/15 px-5 text-left"
        >
          <span className="tracking-wider">1問ごとに交代</span>
          <span className={`relative h-6 w-11 rounded-full transition-colors ${settings.rotate !== false ? "bg-gold/80" : "bg-ivory/15"}`}>
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-ivory transition-transform ${settings.rotate !== false ? "translate-x-6" : "translate-x-1"}`}
            />
          </span>
        </button>
      </div>

      <div className="mt-12">
        <Heading title="シャッフル演出" note="お題を引くとき、カードが高速で切り替わってから止まります。参加者のスマホでも同時に流れます。" />
        <button
          type="button"
          role="switch"
          aria-checked={settings.shuffleFx !== false}
          onClick={actions.toggleShuffle}
          className="flex min-h-14 w-full items-center justify-between border border-ivory/15 px-5 text-left"
        >
          <span className="tracking-wider">シャッフル演出</span>
          <span className={`relative h-6 w-11 rounded-full transition-colors ${settings.shuffleFx !== false ? "bg-gold/80" : "bg-ivory/15"}`}>
            <span
              className={`absolute top-1 h-4 w-4 rounded-full bg-ivory transition-transform ${settings.shuffleFx !== false ? "translate-x-6" : "translate-x-1"}`}
            />
          </span>
        </button>
      </div>

      <div className="mt-12">
        <Heading title="出題モード" note="当日の空気に合わせて、いつでも司会メニューから切り替えられます。" />
        <div className="grid gap-2">
          {MOOD_INFO.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={settings.mood === m.id}
              onClick={() => actions.setMood(m.id)}
              className={`min-h-14 border px-5 py-3 text-left transition-colors ${
                settings.mood === m.id ? "border-gold/80 bg-gold/10" : "border-ivory/15 hover:border-gold/50"
              }`}
            >
              <span className={`block tracking-wider ${settings.mood === m.id ? "text-gold-soft" : ""}`}>{m.label}</span>
              <span className="mt-1 block text-xs text-mist/70">{m.note}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-12 space-y-2 text-sm leading-relaxed text-mist/70">
        <h2 className="mb-3 text-lg font-semibold tracking-[0.2em] text-ivory">使い方のヒント</h2>
        <p>・PC をプロジェクターにつなぐ場合は、全画面（F キー）＋会場モードがおすすめです。</p>
        <p>・→ / Space / PageDown で次へ、← / PageUp で戻ります。プレゼン用リモコンでも操作できます。</p>
        <p>・データはこの端末のブラウザに保存されます（ログイン・サーバー不要）。</p>
      </div>
    </>
  );
}
