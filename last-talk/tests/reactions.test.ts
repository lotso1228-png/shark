import assert from "node:assert/strict";
import { test, mock } from "node:test";
import { REACTION_BATCH_MS, REACTION_HOURLY_CAP, reactionSender } from "../src/lib/liveChannel";

test("リアクション：連打は3秒ごとに1回にまとまり、1時間40回で止まる", async () => {
  mock.timers.enable({ apis: ["setTimeout", "Date"] });
  const sent: string[] = [];
  const react = reactionSender("room", async (b) => {
    sent.push(b);
    return new Response(null, { status: 200 });
  });
  // 15秒間、200msごとに連打（75回タップ）
  for (let t = 0; t < 15000; t += 200) {
    react("clap");
    mock.timers.tick(200);
    await Promise.resolve();
  }
  mock.timers.tick(REACTION_BATCH_MS);
  await Promise.resolve();
  assert.ok(sent.length <= Math.ceil(15000 / REACTION_BATCH_MS) + 1, `sent=${sent.length}`);
  assert.ok(sent.length >= 4);
  // 1時間に送るのは上限まで
  for (let i = 0; i < 200; i++) {
    react("laugh");
    mock.timers.tick(REACTION_BATCH_MS + 10);
    await Promise.resolve();
  }
  assert.equal(sent.length, REACTION_HOURLY_CAP);
  mock.timers.reset();
});
