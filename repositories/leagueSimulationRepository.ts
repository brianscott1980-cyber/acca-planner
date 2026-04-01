import { gameWeeks, type GameWeekRecord } from "../data/gameWeeks";
import {
  leagueData,
  type LeagueMatchdaySimulationRecord,
} from "../data/leagueData";

export type SimulatedTimelineRecord = {
  gameWeek: GameWeekRecord;
  simulation: LeagueMatchdaySimulationRecord;
};

export function getSimulatedNow() {
  return new Date(leagueData.simulatedAtIso);
}

export function getGameWeekSimulation(gameWeekId: string) {
  return (
    leagueData.matchdaySimulations.find(
      (simulation) => simulation.gameWeekId === gameWeekId,
    ) ?? null
  );
}

export function getSortedGameWeeks() {
  return [...gameWeeks]
    .sort(
      (left, right) =>
        new Date(left.windowStartIso).getTime() -
        new Date(right.windowStartIso).getTime(),
    )
    .map(applySimulationToGameWeek);
}

export function getCurrentSimulatedGameWeek() {
  const now = getSimulatedNow().getTime();
  const sortedGameWeeks = getSortedGameWeeks();

  return (
    sortedGameWeeks.find(
      (gameWeek) => new Date(gameWeek.windowEndIso).getTime() >= now,
    ) ?? sortedGameWeeks[sortedGameWeeks.length - 1]
  );
}

export function getCompletedSimulatedGameWeeks() {
  const now = getSimulatedNow();

  return getSortedGameWeeks().filter((gameWeek) => isGameWeekClosed(gameWeek, now));
}

export function getSettledSimulatedTimelineRecords() {
  const simulatedNow = getSimulatedNow().getTime();

  return getSortedGameWeeks()
    .map((gameWeek) => {
      const simulation = getGameWeekSimulation(gameWeek.id);

      if (
        !simulation ||
        new Date(simulation.simulatedSlip.settledAt).getTime() > simulatedNow
      ) {
        return null;
      }

      return {
        gameWeek,
        simulation,
      };
    })
    .filter((entry) => entry !== null)
    .sort(
      (left, right) =>
        new Date(right.simulation.simulatedSlip.settledAt).getTime() -
        new Date(left.simulation.simulatedSlip.settledAt).getTime(),
    );
}

export function getVisibleSimulatedTimelineRecords() {
  const simulatedNow = getSimulatedNow().getTime();

  return getSortedGameWeeks()
    .map((gameWeek) => {
      const simulation = getGameWeekSimulation(gameWeek.id);

      if (
        !simulation ||
        new Date(simulation.voteResolvedAtIso).getTime() > simulatedNow
      ) {
        return null;
      }

      return {
        gameWeek,
        simulation,
      };
    })
    .filter((entry) => entry !== null)
    .sort(
      (left, right) =>
        new Date(left.gameWeek.windowStartIso).getTime() -
        new Date(right.gameWeek.windowStartIso).getTime(),
    );
}

export function getGameWeekTimingLabel(gameWeek: GameWeekRecord) {
  const now = getSimulatedNow().getTime();
  const windowStart = new Date(gameWeek.windowStartIso).getTime();
  const windowEnd = new Date(gameWeek.windowEndIso).getTime();

  if (windowEnd < now) {
    return "Closed";
  }

  if (windowStart <= now) {
    return "Live Now";
  }

  return gameWeek.startsIn;
}

export function isGameWeekVoteResolved(
  gameWeek: GameWeekRecord,
  simulatedNow: Date = getSimulatedNow(),
) {
  const simulation = getGameWeekSimulation(gameWeek.id);

  if (!simulation) {
    return false;
  }

  return (
    new Date(simulation.voteResolvedAtIso).getTime() <= simulatedNow.getTime()
  );
}

export function isGameWeekClosed(
  gameWeek: GameWeekRecord,
  simulatedNow: Date = getSimulatedNow(),
) {
  return new Date(gameWeek.windowEndIso).getTime() < simulatedNow.getTime();
}

export function formatGameWeekDateRange(gameWeek: GameWeekRecord) {
  const start = new Date(gameWeek.windowStartIso);
  const end = new Date(gameWeek.windowEndIso);
  const startLabel = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(start);
  const endLabel = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(end);

  return `${startLabel} - ${endLabel}`;
}

function applySimulationToGameWeek(gameWeek: GameWeekRecord) {
  const simulation = getGameWeekSimulation(gameWeek.id);

  if (!simulation) {
    return gameWeek;
  }

  const simulatedNow = getSimulatedNow().getTime();
  const voteResolved =
    new Date(simulation.voteResolvedAtIso).getTime() <= simulatedNow;
  const stakePlaced =
    new Date(simulation.betPlacedAtIso).getTime() <= simulatedNow;

  return {
    ...gameWeek,
    proposals: gameWeek.proposals.map((proposal) => ({
      ...proposal,
      betLines: proposal.betLines.map((betLine) => {
        const simulatedOdds = simulation.betLineOddsByLabel[betLine.label];

        if (!simulatedOdds) {
          return betLine;
        }

        return {
          ...betLine,
          odds: simulatedOdds,
          marketId: undefined,
        };
      }),
    })),
    votesByUserId: voteResolved ? simulation.votesByUserId : {},
    simulatedSlip: stakePlaced
      ? {
          proposalId: simulation.simulatedSlip.proposalId,
          timelineLabel: simulation.simulatedSlip.timelineLabel,
          stake: simulation.simulatedSlip.stake,
          stakePlacedAt: simulation.simulatedSlip.stakePlacedAt,
          settledAt: simulation.simulatedSlip.settledAt,
          settlementKind: simulation.simulatedSlip.settlementKind,
          returnAmount: simulation.simulatedSlip.returnAmount,
          status: simulation.simulatedSlip.status,
        }
      : undefined,
  };
}
