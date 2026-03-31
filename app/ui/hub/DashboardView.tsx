"use client";

import { getUserVoteForGameWeek } from "../../../repositories/gameWeekRepository";
import { ConsensusPanel } from "./ConsensusPanel";
import { useCurrentGameWeek } from "./GameWeekProvider";
import { GameweekBoard } from "./GameweekBoard";

export function DashboardView() {
  const { currentGameWeek, loggedInUserId } = useCurrentGameWeek();
  const hasUserVote = loggedInUserId
    ? Boolean(getUserVoteForGameWeek(currentGameWeek, loggedInUserId))
    : false;

  return (
    <div
      className={`hub-grid ${
        hasUserVote ? "hub-grid-mobile-voted" : "hub-grid-mobile-unvoted"
      }`}
    >
      <section className="hub-column-main">
        <GameweekBoard />
      </section>

      <aside className="hub-column-side">
        <ConsensusPanel />
      </aside>
    </div>
  );
}
