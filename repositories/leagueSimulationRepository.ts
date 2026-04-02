import {
  matchdaySchedule,
  type GameWeekRecord,
} from "../data/matchday_schedule";
import type { LeagueMatchdaySimulationRow } from "../data/league_data_entities";
import { leagueDataMatchdaySimulations } from "../data/league_data_matchday_simulations";
import {
  getLeagueSimulatedAtIso,
  getLeagueUpdatedAtIso,
} from "./leagueMetaRepository";
import { getSimulationBetLineOddsByLabel } from "./leagueSimulationOddsRepository";
import {
  getSimulationSlipRecord,
  type LeagueSimulationSlipRecord,
} from "./leagueSimulationSlipRepository";
import { getSimulationVotesByUserId } from "./leagueSimulationVoteRepository";

export type LeagueMatchdaySimulationRecord = {
  gameWeekId: string;
  voteResolvedAtIso: string;
  betPlacedAtIso: string;
  selectedProposalId: string;
  votesByUserId: Record<string, string>;
  betLineOddsByLabel: Record<string, string>;
  simulatedSlip: LeagueSimulationSlipRecord;
};

export type LeagueDataRecord = {
  simulatedAtIso: string;
  updatedAtIso: string;
  matchdaySimulations: LeagueMatchdaySimulationRecord[];
};

export function getLeagueData(): LeagueDataRecord {
  return {
    simulatedAtIso: getLeagueSimulatedAtIso(),
    updatedAtIso: getLeagueUpdatedAtIso(),
    matchdaySimulations: leagueDataMatchdaySimulations.map(
      composeMatchdaySimulationRecord,
    ),
  };
}

export type SimulatedTimelineRecord = {
  gameWeek: GameWeekRecord;
  simulation: LeagueMatchdaySimulationRecord;
};

export function getSimulatedNow() {
  return new Date(getLeagueSimulatedAtIso());
}

export function getSimulationUpdatedAtIso() {
  return getLeagueUpdatedAtIso();
}

export function getGameWeekSimulation(gameWeekId: string) {
  const leagueData = getLeagueData();

  return (
    leagueData.matchdaySimulations.find(
      (simulation) => simulation.gameWeekId === gameWeekId,
    ) ?? null
  );
}

export function getSortedGameWeeks() {
  const leagueData = getLeagueData();
  const availableGameWeekIds = new Set(
    leagueData.matchdaySimulations.map((simulation) => simulation.gameWeekId),
  );
  const visibleGameWeeks =
    availableGameWeekIds.size > 0
      ? matchdaySchedule.filter((gameWeek) => availableGameWeekIds.has(gameWeek.id))
      : matchdaySchedule;

  return [...visibleGameWeeks]
    .sort(
      (left, right) =>
        new Date(left.windowStartIso).getTime() -
        new Date(right.windowStartIso).getTime(),
    )
    .map(applySimulationToGameWeek);
}

function composeMatchdaySimulationRecord(
  simulation: LeagueMatchdaySimulationRow,
): LeagueMatchdaySimulationRecord {
  return {
    gameWeekId: simulation.gameWeekId,
    voteResolvedAtIso: simulation.voteResolvedAtIso,
    betPlacedAtIso: simulation.betPlacedAtIso,
    selectedProposalId: simulation.selectedProposalId,
    votesByUserId: getSimulationVotesByUserId(simulation.id),
    betLineOddsByLabel: getSimulationBetLineOddsByLabel(simulation.id),
    simulatedSlip: getSimulationSlipRecord(simulation.slipId),
  };
}

export function getCurrentSimulatedGameWeek() {
  const now = getSimulatedNow().getTime();
  const sortedGameWeeks = getSortedGameWeeks();

  return (
    sortedGameWeeks.find((gameWeek) => !gameWeek.simulatedSlip) ??
    sortedGameWeeks.find(
      (gameWeek) => new Date(gameWeek.windowEndIso).getTime() >= now,
    ) ??
    sortedGameWeeks[sortedGameWeeks.length - 1]
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
    return `Closed · ${gameWeek.startsIn}`;
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
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    timeZone: "Europe/London",
  });
  const startLabel = formatter.format(start);
  const endLabel = formatter.format(end);

  if (startLabel === endLabel) {
    return startLabel;
  }

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
          legResults: simulation.simulatedSlip.legResults,
        }
      : undefined,
  };
}
