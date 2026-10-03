import assert from "node:assert/strict";
import { test } from "node:test";
import * as E from "../src/lib/engine";
import { DEFAULT_TOPICS } from "../src/lib/topics";
import type { GameState, Graduate } from "../src/lib/types";

const grads: Graduate[] = [
  { id: "a", name: "山田太郎", nickname: "山田さん" },
  { id: "b", name: "田中一郎", nickname: "田中さん" },
  { id: "c", name: "鈴木次郎", nickname: "鈴木さん" },
];
const ctx = (extra: Partial<E.DrawContext> = {}): E.DrawContext => ({
  topics: DEFAULT_TOPICS, graduates: grads, mood: "normal", ...extra,
});
const startFor = (id: string): GameState => ({ ...E.initialGame(), screen: "ready", graduateId: id });
const topicIds = (g: GameState) =>
  g.history.flatMap((h) => (h.card.kind === "topic" ? [h.card.topicId] : []));

test("同じお題は全て使い切るまで出ない・連続しない", () => {
  for (let run = 0; run < 200; run++) {
    let g = startFor("a");
    g = E.setChapter(g, "laugh");
    const n = DEFAULT_TOPICS.filter((t) => t.category === "laugh").length;
    for (let i = 0; i < n * 3; i++) g = E.draw(g, ctx({ mood: run % 2 ? "hype" : "normal" }));
    const ids = topicIds(g);
    // 最初の n 枚は重複なし
    const firstRound = ids.slice(0, n);
    assert.equal(new Set(firstRound).size, firstRound.length, "1巡目に重複");
    for (let i = 1; i < ids.length; i++) assert.notEqual(ids[i], ids[i - 1], "連続して同じお題");
  }
});

test("流れ：笑い → 思い出 → 仲間 で自動進行し、LAST は温存", () => {
  let g = startFor("a");
  const seen: string[] = [];
  for (let i = 0; i < 40; i++) {
    g = E.draw(g, ctx({ rng: () => 0.99 })); // 0.99 → 特別カードは出ない
    seen.push(g.chapter);
  }
  const order = [...new Set(seen)];
  assert.deepEqual(order, ["laugh", "memory", "friends"]);
  assert.ok(E.isFlowComplete(g, grads.length));
  assert.ok(g.history.every((h) => h.card.kind !== "topic" || h.card.category !== "last"));
});

test("戻る/進む（NEXT は先の履歴を再表示）", () => {
  let g = startFor("a");
  g = E.draw(g, ctx());
  g = E.draw(g, ctx());
  g = E.draw(g, ctx());
  const third = g.history[2];
  g = E.back(g);
  assert.equal(g.cursor, 1);
  g = E.next(g, ctx());
  assert.equal(g.cursor, 2);
  assert.deepEqual(g.history[2], third);
  g = E.back(E.back(E.back(g)));
  assert.equal(g.cursor, -1);
  assert.equal(g.screen, "ready");
});

test("卒業生切り替え：履歴は卒業生ごとに記録、戻ると名前も戻る", () => {
  let g = startFor("a");
  g = E.draw(g, ctx());
  g = { ...g, graduateId: "b" };
  g = E.draw(g, ctx());
  assert.equal(g.history[1].graduateId, "b");
  g = E.back(g);
  assert.equal(g.graduateId, "a");
  g = E.next(g, ctx());
  assert.equal(g.graduateId, "b");
  assert.equal(E.countFor(g, "a"), 1);
  assert.equal(E.countFor(g, "b"), 1);
});

test("スキップは別のお題に差し替え（履歴は増えない）", () => {
  let g = startFor("a");
  g = E.draw(g, ctx({ rng: () => 0.5 }));
  const before = g.history[0].card;
  g = E.skip(g, ctx());
  assert.equal(g.history.length, 1);
  assert.notDeepEqual(g.history[0].card, before);
});

test("特別カードは低確率で、連続しない", () => {
  let g = startFor("a");
  let specials = 0;
  const N = 3000;
  for (let i = 0; i < N; i++) {
    const prev = E.currentEntry(g);
    g = E.draw(g, ctx());
    const cur = E.currentEntry(g)!;
    if (cur.card.kind === "special") {
      specials++;
      assert.notEqual(prev?.card.kind, "special");
    }
  }
  const rate = specials / N;
  assert.ok(rate > 0.04 && rate < 0.15, `rate=${rate}`);
});

test("LAST MESSAGE：全員終わるとフィナーレ", () => {
  let g = E.enterLast({ ...startFor("b") }, grads);
  assert.equal(g.screen, "last-intro");
  assert.equal(g.graduateId, "b");
  const done: string[] = [];
  for (let i = 0; i < grads.length; i++) {
    g = E.revealLast(g, ctx());
    assert.equal(g.screen, "last-question");
    assert.ok(g.lastCard?.text);
    done.push(g.lastCard!.topicId);
    g = E.finishLast(g, grads);
  }
  assert.equal(g.screen, "finale");
  assert.equal(new Set(done).size, grads.length, "LAST のお題が重複");
});

test("LAST MESSAGE：戻って再度 MESSAGE を押しても同じお題", () => {
  let g = E.enterLast(startFor("a"), grads);
  g = E.revealLast(g, ctx());
  const text = g.lastCard!.text;
  g = { ...g, screen: "last-intro" };
  g = E.revealLast(g, ctx());
  assert.equal(g.lastCard!.text, text);
});

test("仲間カテゴリーの指名カード", () => {
  let g = E.setChapter(startFor("a"), "friends");
  g = E.draw(g, ctx({ rng: () => 0.99 }));
  g = E.reply(g);
  assert.equal(E.currentEntry(g)!.card.kind, "reply");
  g = E.back(g);
  assert.equal(E.currentEntry(g)!.card.kind, "topic");
});

test("自動進行：カテゴリーを使い切っても他の未使用お題を優先し、全体を使い切るまで重複しない", () => {
  let g = startFor("a");
  const total = DEFAULT_TOPICS.filter((t) => t.category !== "last").length;
  for (let i = 0; i < total; i++) g = E.draw(g, ctx({ rng: () => 0.99 }));
  const ids = topicIds(g);
  assert.equal(ids.length, total);
  assert.equal(new Set(ids).size, total);
  assert.ok(ids.every((id) => !id.includes("-last-")));
});

test("カテゴリー変更直後は特別カードを出さない", () => {
  for (let i = 0; i < 300; i++) {
    let g = E.draw(E.draw(startFor("a"), ctx()), ctx());
    g = E.draw(E.setChapter(g, "memory"), ctx({ noSpecial: true, mood: "hype" }));
    const c = E.currentEntry(g)!.card;
    assert.equal(c.kind, "topic");
    assert.equal(c.kind === "topic" && c.category, "memory");
  }
});
