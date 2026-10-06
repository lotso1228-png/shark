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
  const total = DEFAULT_TOPICS.filter((t) => t.category !== "last" && t.category !== "crowd").length;
  const gradIds = (x: GameState) => topicIds(x).filter((id) => !id.includes("-crowd-"));
  for (let i = 0; i < total * 3 && gradIds(g).length < total; i++) g = E.draw(g, ctx({ rng: () => 0.99 }));
  const ids = gradIds(g);
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

test("1問ごとに交代：NEXTのたびに話す人が替わり、全員に均等に回る", () => {
  let g = E.draw(startFor("a"), ctx());
  const speakers = [g.history[0].graduateId];
  for (let i = 0; i < 8; i++) {
    g = E.next(g, { ...ctx(), rotate: true });
    speakers.push(E.currentEntry(g)!.graduateId);
  }
  for (let i = 1; i < speakers.length; i++) assert.notEqual(speakers[i], speakers[i - 1], "同じ人が連続");
  assert.deepEqual(speakers, ["a", "b", "c", "a", "b", "c", "a", "b", "c"]);
});

test("1問ごとに交代：戻ってから進むときは同じ人・同じお題のまま", () => {
  let g = E.draw(startFor("a"), ctx());
  g = E.next(g, { ...ctx(), rotate: true });
  const second = E.currentEntry(g)!;
  g = E.next(E.back(g), { ...ctx(), rotate: true });
  assert.deepEqual(E.currentEntry(g), second);
});

test("1問ごとに交代：オフなら同じ人が続く", () => {
  let g = E.draw(startFor("a"), ctx());
  g = E.next(g, { ...ctx(), rotate: false });
  assert.equal(E.currentEntry(g)!.graduateId, "a");
});

test("現役トーク：卒業生のお題2枚ごとに1枚はさまり、続けては出ず、{name} が卒業生の呼び名になる", () => {
  let g = E.draw(startFor("a"), ctx({ rng: () => 0.99 }));
  let crowd = 0;
  for (let i = 0; i < 300; i++) {
    const prev = E.currentEntry(g)!;
    g = E.next(g, { ...ctx(), rotate: true });
    const cur = E.currentEntry(g)!;
    if (cur.card.kind === "topic" && cur.card.category === "crowd") {
      crowd++;
      const h = g.history;
      assert.ok(h.length < 3 || h.slice(-3, -1).every((e) => !(e.card.kind === "topic" && e.card.category === "crowd")), "間隔が短い");
      assert.ok(!(prev.card.kind === "topic" && prev.card.category === "crowd"), "現役向けが連続");
      assert.ok(!cur.card.text.includes("{name}"));
      const n = grads.find((x) => x.id === cur.graduateId)!.nickname;
      assert.ok(cur.card.text.includes(n), `呼び名が入っていない: ${cur.card.text}`);
    }
  }
  assert.ok(crowd >= 95 && crowd <= 100, `crowd=${crowd}`);
});

test("卒業生3名：1章3問（全員に各章1問ずつ回る）", () => {
  assert.equal(E.chapterQuota(3), 3);
  assert.equal(E.chapterQuota(1), 3);
  assert.equal(E.chapterQuota(12), 10);
});

import { upgradeTopics } from "../src/lib/topicUpgrade";

test("お題の入れ替え：自分で編集・追加したお題は残り、未編集の標準お題だけ新しくなる", () => {
  const saved = [
    // 前の版の標準お題（未編集）→ 新しい版に入れ替わる
    { id: "std4-laugh-01", category: "laugh", text: "正直、JCにいくら使った？元は取れた？", tags: [], builtIn: true },
    // 前の版の標準お題を書き換えたもの（edited フラグがない古いデータ）→ 残す
    { id: "std4-laugh-02", category: "laugh", text: "うちの理事長の一番の伝説は？", tags: [], builtIn: true },
    // 編集フラグ付き → 残す
    { id: "std4-memory-01", category: "memory", text: "自分で直したお題", tags: [], builtIn: false, edited: true },
    // 自分で追加 → 残す
    { id: "custom-1", category: "friends", text: "自作のお題", tags: [], builtIn: false },
  ] as const;
  const out = upgradeTopics(saved.map((t) => ({ ...t, tags: [] })));
  const texts = out.map((t) => t.text);
  assert.ok(!texts.includes("正直、JCにいくら使った？元は取れた？"), "未編集の古い標準お題が残っている");
  assert.ok(texts.includes("うちの理事長の一番の伝説は？"), "編集したお題が消えた");
  assert.ok(texts.includes("自分で直したお題"));
  assert.ok(texts.includes("自作のお題"));
  assert.equal(out.find((t) => t.text === "うちの理事長の一番の伝説は？")!.builtIn, false);
  assert.ok(texts.includes(DEFAULT_TOPICS[0].text), "新しい標準お題が入っていない");
  // もう一度入れ替えても増えたり消えたりしない
  assert.deepEqual(upgradeTopics(out).map((t) => t.text).sort(), texts.slice().sort());
});

test("乾杯カード：卒業生の名前が入る", async () => {
  const { cardView } = await import("../src/lib/cardView");
  const v = cardView({ kind: "special", special: "toast" }, "山田さん");
  assert.equal(v.text, "ここで全員、乾杯！");
  assert.ok(v.note?.includes("山田さんの音頭で"));
});

test("優勝ポイント：話している卒業生に加算し、それ以外の画面では数えない", () => {
  let g = E.draw(startFor("a"), ctx({ rng: () => 0.99 }));
  g = E.addScores(g, { clap: 3, laugh: 2 });
  g = E.next(g, { ...ctx({ rng: () => 0.99 }), rotate: true }); // b に交代
  g = E.addScores(g, { cry: 1 });
  assert.equal(E.scoreTotal(g.scores!.a), 5);
  assert.equal(E.scoreTotal(g.scores!.b), 1);
  // 卒業生選択画面中のリアクションは数えない
  const sel = E.addScores({ ...g, screen: "select" }, { fire: 9 });
  assert.deepEqual(sel.scores, g.scores);
  // 1回のメッセージで加算されるのは各種類20まで
  assert.equal(E.scoreTotal(E.addScores(g, { clap: 999 }).scores!.b), 21);
});

test("優勝発表：LAST MESSAGE が全員終わると発表へ、同点は同順位", () => {
  let g: GameState = { ...startFor("a"), screen: "topic", scores: { a: { clap: 5 }, b: { laugh: 5 }, c: { fire: 1 } } };
  const r = E.ranking(g, grads);
  assert.deepEqual(r.map((x) => [x.id, x.rank]), [["a", 1], ["b", 1], ["c", 3]]);
  g = E.enterLast(g, grads);
  for (let i = 0; i < grads.length; i++) g = E.finishLast(E.revealLast(g, ctx()), grads);
  assert.equal(g.screen, "award");
  // リアクションがひとつもなければ、発表は飛ばしてフィナーレへ
  let h = E.enterLast({ ...startFor("a"), screen: "topic" }, grads);
  for (let i = 0; i < grads.length; i++) h = E.finishLast(E.revealLast(h, ctx()), grads);
  assert.equal(h.screen, "finale");
});

test("お題の入れ替え（v5→v6）：未編集の旧お題は新しくなり、編集扱いにならない", () => {
  const out = upgradeTopics([
    { id: "std5-friends-06", category: "friends", text: "次の理事長は誰？そう思う理由のエピソードも。", tags: [], builtIn: true },
  ]);
  assert.ok(!out.some((t) => t.text === "次の理事長は誰？そう思う理由のエピソードも。"));
  assert.ok(out.some((t) => t.text === "いつか理事長になりそうな現役は？そう思うエピソードも。"));
  assert.ok(out.every((t) => !t.edited));
});

test("判定タイム：目標に届けばセーフ、届かなければアウト。受付終了後の猶予を過ぎたら数えない", () => {
  const t0 = 1_000_000;
  let g: GameState = E.draw(startFor("a"), ctx({ rng: () => 0.99 }));
  g = E.startJudge(g, 15, t0, "j1");
  assert.equal(g.judge!.target, 30);
  g = E.countJudge(g, { clap: 20 }, t0 + 5000);
  g = E.countJudge(g, { laugh: 9 }, t0 + E.JUDGE_SECONDS * 1000 + 2000); // 猶予内
  g = E.countJudge(g, { fire: 20 }, t0 + E.JUDGE_SECONDS * 1000 + E.JUDGE_GRACE_MS + 1); // 猶予後
  assert.equal(g.judge!.count, 29);
  assert.equal(E.finishJudge(g).judge!.result, "out");
  assert.equal(E.finishJudge(E.countJudge(g, { clap: 1 }, t0 + 6000)).judge!.result, "safe");
  assert.equal(E.judgeTarget(0), 6);
});

test("エピソード判定：卒業生の話へのリアクションが目標未満なら、NEXT でアウトを出す", () => {
  // 笑いのお題（卒業生の話）
  let g = E.draw(startFor("a"), ctx({ rng: () => 0.99 }));
  assert.ok(E.isEpisodeCard(g));
  g = E.tallyCard(g, { clap: 3 });
  const out = E.episodeCheck(g, 10, grads, "p1");
  assert.ok(out?.penalty);
  assert.equal(out!.penalty!.name, "山田さん");
  assert.equal(out!.penalty!.count, 3);
  assert.equal(out!.penalty!.target, 10);
  // 目標に届いていればアウトにならない
  assert.equal(E.episodeCheck(E.tallyCard(g, { laugh: 7 }), 10, grads, "p2"), null);
  // 参加者がいなければ判定しない
  assert.equal(E.episodeCheck(g, 0, grads, "p3"), null);
  // 次のカードではリアクション数が0から数え直し
  const n = E.next(g, { ...ctx({ rng: () => 0.99 }), rotate: true });
  assert.notEqual(E.cardKey(n), g.tally!.key);
});

test("エピソード判定：現役向け・特別カードは対象外", () => {
  const crowdCard: GameState = {
    ...startFor("a"),
    screen: "topic",
    history: [{ graduateId: "a", card: { kind: "topic", topicId: "x", category: "crowd", text: "t" } }],
    cursor: 0,
  };
  assert.equal(E.isEpisodeCard(crowdCard), false);
  const special: GameState = { ...crowdCard, history: [{ graduateId: "a", card: { kind: "special", special: "toast" } }] };
  assert.equal(E.isEpisodeCard(special), false);
});

test("ホント？盛ってる？：1人1票、盛ってるが多ければ一杯、同数はホント", () => {
  const t0 = 5_000_000;
  let g: GameState = E.draw(startFor("b"), ctx({ rng: () => 0.99 }));
  g = E.startVote(g, grads, t0, "v1");
  assert.equal(g.vote!.name, "田中さん");
  g = E.castVote(g, "v1", "dev1", "fake", t0 + 1000);
  g = E.castVote(g, "v1", "dev1", "real", t0 + 2000); // 2票目は無効
  g = E.castVote(g, "v1", "dev2", "fake", t0 + 3000);
  g = E.castVote(g, "v1", "dev3", "real", t0 + 4000);
  g = E.castVote(g, "old", "dev4", "real", t0 + 4000); // 別の投票
  g = E.castVote(g, "v1", "dev5", "real", t0 + 60_000); // 締め切り後
  assert.deepEqual([g.vote!.fake, g.vote!.real], [2, 1]);
  assert.equal(E.finishVote(g).vote!.result, "fake");
  assert.equal(E.finishVote(E.castVote(g, "v1", "dev6", "real", t0 + 5000)).vote!.result, "real");
});

test("エピソード判定：投票や判定タイムを済ませたカードでは二重に飲ませない", () => {
  let g = E.draw(startFor("a"), ctx({ rng: () => 0.99 }));
  g = E.finishVote(E.startVote(g, grads, 0, "v1"));
  assert.equal(E.episodeCheck({ ...g, vote: null }, 10, grads, "p"), null);
  let h = E.draw(startFor("b"), ctx({ rng: () => 0.99 }));
  h = E.startJudge(h, 10, 0, "j");
  assert.equal(E.episodeCheck({ ...h, judge: null }, 10, grads, "p"), null);
});

test("お題を選ぶ：選んだお題がすぐ出て、交代オンなら次の人に回り、戻るで前のお題に戻れる", () => {
  let g = E.draw(startFor("a"), ctx());
  const before = E.currentEntry(g)!;
  const t = DEFAULT_TOPICS.find((x) => x.category === "memory")!;
  g = E.chooseTopic(g, t.id, { ...ctx(), rotate: true });
  const cur = E.currentEntry(g)!;
  assert.equal(cur.card.kind === "topic" && cur.card.topicId, t.id);
  assert.notEqual(cur.graduateId, "a");
  assert.ok(g.usedTopicIds.includes(t.id));
  g = E.back(g);
  assert.deepEqual(E.currentEntry(g), before);
});
