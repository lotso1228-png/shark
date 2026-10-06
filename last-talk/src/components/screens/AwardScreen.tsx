"use client";

import { ranking } from "@/lib/engine";
import { AwardView } from "../AwardView";
import { displayName, useStore } from "../StoreProvider";
import { BackArrow } from "../ui";

/** 司会者側の優勝発表（「結果発表」→ 順位 → フィナーレへ） */
export function AwardScreen() {
  const { game, graduates, settings, actions } = useStore();
  const rows = ranking(game, graduates).map((r) => ({
    name: displayName(graduates.find((g) => g.id === r.id)),
    total: r.total,
    rank: r.rank,
    counts: r.counts,
  }));
  return (
    <div className="relative h-full">
      {!settings.venueMode && (
        <div className="absolute top-4 left-5 z-20">
          <BackArrow onClick={() => actions.goTo("last-intro")} />
        </div>
      )}
      <AwardView
        key={game.awardRevealed ? "open" : "wait"}
        rows={rows}
        revealed={!!game.awardRevealed}
        onReveal={actions.revealAward}
        onFinale={() => actions.goTo("finale")}
      />
    </div>
  );
}
