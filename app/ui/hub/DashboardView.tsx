"use client";

import { useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import type { GameWeekProposalRecord } from "../../../data/gameWeeks";
import { getUserVoteForGameWeek } from "../../../repositories/gameWeekRepository";
import { ConsensusPanel } from "./ConsensusPanel";
import { GameWeekProvider } from "./GameWeekProvider";
import { useCurrentGameWeek } from "./GameWeekProvider";
import { GameweekBoard } from "./GameweekBoard";

type DashboardViewProps = {
  decisionParam?: string | null;
};

export function DashboardView({ decisionParam = null }: DashboardViewProps) {
  const { currentGameWeek, loggedInUserId } = useCurrentGameWeek();
  const hasHydrated = useSyncExternalStore(
    subscribeToClientSnapshot,
    getClientSnapshot,
    getServerSnapshot,
  );
  const decidedProposal = getDecisionProposal(
    currentGameWeek.proposals,
    decisionParam,
  );
  const hasUserVote = hasHydrated && loggedInUserId
    ? Boolean(getUserVoteForGameWeek(currentGameWeek, loggedInUserId))
    : false;
  const isDecisionView = Boolean(decidedProposal);

  return (
    <div
      className={`hub-grid ${
        isDecisionView
          ? "hub-grid-decision"
          : hasUserVote
            ? "hub-grid-mobile-voted"
            : "hub-grid-mobile-unvoted"
      }`}
    >
      <section className="hub-column-main">
        <GameweekBoard decidedProposal={decidedProposal} />
      </section>

      {!isDecisionView ? (
        <aside className="hub-column-side">
          <ConsensusPanel />
        </aside>
      ) : null}
    </div>
  );
}

export function DashboardViewWithSearchParams() {
  const searchParams = useSearchParams();
  const matchdayParam =
    searchParams.get("matchday") ?? searchParams.get("gameWeek");

  return (
    <GameWeekProvider
      key={matchdayParam ?? "current-matchday"}
      gameWeekId={matchdayParam}
    >
      <DashboardView decisionParam={searchParams.get("decision")} />
    </GameWeekProvider>
  );
}

function subscribeToClientSnapshot() {
  return () => {};
}

function getClientSnapshot() {
  return true;
}

function getServerSnapshot() {
  return false;
}

function getDecisionProposal(
  proposals: GameWeekProposalRecord[],
  decisionParam: string | null,
) {
  if (!decisionParam) {
    return null;
  }

  const normalizedDecision = decisionParam.trim().toLowerCase();
  const proposalId =
    normalizedDecision === "defensive" || normalizedDecision === "safe"
      ? "defensive"
      : normalizedDecision === "neutral" || normalizedDecision === "balanced"
        ? "neutral"
        : normalizedDecision === "aggressive" ||
            normalizedDecision === "aggresive" ||
            normalizedDecision === "profit"
          ? "aggressive"
          : null;

  return proposalId
    ? proposals.find((proposal) => proposal.id === proposalId) ?? null
    : null;
}
