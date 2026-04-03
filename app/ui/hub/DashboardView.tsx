"use client";

import { useSyncExternalStore } from "react";
import { useSearchParams } from "next/navigation";
import {
  getGameWeekSelectedProposal,
  type GameWeekViewState,
  getGameWeekViewState,
  getUserVoteForGameWeek,
} from "../../../services/game_week_service";
import { getSimulationUpdatedAtIso } from "../../../services/league_simulation_service";
import { ConsensusPanel } from "./ConsensusPanel";
import { GameWeekProvider } from "./GameWeekProvider";
import { useCurrentGameWeek } from "./GameWeekProvider";
import { GameweekBoard } from "./GameweekBoard";

type DashboardViewProps = {
  forcedProposalId?: string | null;
  forcedViewState?: GameWeekViewState | null;
};

export function DashboardView({
  forcedProposalId = null,
  forcedViewState = null,
}: DashboardViewProps) {
  const { currentGameWeek, loggedInUserId } = useCurrentGameWeek();
  const hasHydrated = useSyncExternalStore(
    subscribeToClientSnapshot,
    getClientSnapshot,
    getServerSnapshot,
  );
  const gameWeekViewState = getGameWeekViewState(currentGameWeek);
  const effectiveViewState = forcedViewState ?? gameWeekViewState;
  const forcedProposal =
    forcedProposalId
      ? currentGameWeek.proposals.find((proposal) => proposal.id === forcedProposalId) ??
        null
      : null;
  const decidedProposal =
    forcedProposal ??
    getGameWeekSelectedProposal(currentGameWeek);
  const hasUserVote = hasHydrated && loggedInUserId
    ? Boolean(getUserVoteForGameWeek(currentGameWeek, loggedInUserId))
    : false;
  const isDecisionView = effectiveViewState !== "voting" && Boolean(decidedProposal);

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
        <GameweekBoard
          decidedProposal={decidedProposal}
          viewState={effectiveViewState}
        />
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
  return <DashboardViewWithRouteGameWeekId />;
}

export function DashboardViewWithRouteGameWeekId({
  routeGameWeekId = null,
  routeForcedProposalId = null,
  routeViewState = null,
}: {
  routeGameWeekId?: string | null;
  routeForcedProposalId?: string | null;
  routeViewState?: GameWeekViewState | null;
}) {
  const searchParams = useSearchParams();
  const simulationUpdatedAtIso = getSimulationUpdatedAtIso();
  const matchdayParam =
    routeGameWeekId ??
    searchParams.get("matchday") ??
    searchParams.get("gameWeek");

  return (
    <GameWeekProvider
      key={`${matchdayParam ?? "current-matchday"}:${simulationUpdatedAtIso}`}
      gameWeekId={matchdayParam}
    >
      <DashboardView
        forcedProposalId={routeForcedProposalId}
        forcedViewState={routeViewState}
      />
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
