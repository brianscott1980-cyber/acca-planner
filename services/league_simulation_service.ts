import { getMatchdaySchedule } from "./matchday_schedule_service";
import { getLeagueSimulatedAtIso, getLeagueUpdatedAtIso } from "../repositories/league_meta_repository";
import { getLeagueMatchdaySimulationRows, getLeagueMatchdaySimulationRowByGameWeekId } from "../repositories/league_simulation_repository";
import { getLeagueSimulationBetLineOddsRows } from "../repositories/league_simulation_odds_repository";
import { getLeagueSimulationVoteRows } from "../repositories/league_simulation_vote_repository";
import { getSimulationSlipRecord } from "./league_simulation_slip_service";
import type {
  GameWeekRecord,
} from "../types/matchday_type";
import type {
  LeagueDataRecord,
  LeagueMatchdaySimulationRecord,
  LeagueMatchdaySimulationRow,
} from "../types/league_simulation_type";

export function getLeagueData(): LeagueDataRecord {
  return {
    simulatedAtIso: getLeagueSimulatedAtIso(),
    updatedAtIso: getLeagueUpdatedAtIso(),
    matchdaySimulations: getLeagueMatchdaySimulationRows().map(
      composeMatchdaySimulationRecord,
    ),
  };
}

export function isUsingSimulatedClock() {
  const configuredClockMode = process.env.NEXT_PUBLIC_CLOCK_MODE?.trim().toLowerCase();

  if (configuredClockMode) {
    return configuredClockMode === "simulated";
  }

  // Backward compatibility for older local setups.
  return process.env.SIMULATED_CLOCK === "1";
}

export function getSimulatedNow() {
  const useSimulatedClock = isUsingSimulatedClock();

  if (!useSimulatedClock) {
    return new Date();
  }

  return new Date(getLeagueSimulatedAtIso());
}

export function getSimulationUpdatedAtIso() {
  return getLeagueUpdatedAtIso();
}

export function getGameWeekSimulation(gameWeekId: string) {
  const simulationRow = getLeagueMatchdaySimulationRowByGameWeekId(gameWeekId);
  return simulationRow ? composeMatchdaySimulationRecord(simulationRow) : null;
}

export function getSortedGameWeeks() {
  // Always include the full local matchday schedule.
  // A game week can be valid and visible before any simulation row exists.
  return [...getMatchdaySchedule()]
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
  const firstOpenVotingGameWeek = sortedGameWeeks.find(
    (gameWeek) => !isGameWeekVoteResolved(gameWeek),
  );

  return (
    firstOpenVotingGameWeek ??
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

function composeMatchdaySimulationRecord(
  simulation: LeagueMatchdaySimulationRow,
): LeagueMatchdaySimulationRecord {
  return {
    gameWeekId: simulation.gameWeekId,
    voteResolvedAtIso: simulation.voteResolvedAtIso,
    betPlacedAtIso: simulation.betPlacedAtIso,
    selectedProposalId: simulation.selectedProposalId,
    votesByUserId: getLeagueSimulationVoteRows(simulation.id).reduce<Record<string, string>>(
      (accumulator, voteRow) => {
        accumulator[voteRow.userId] = voteRow.proposalId;
        return accumulator;
      },
      {},
    ),
    betLineOddsByLabel: getLeagueSimulationBetLineOddsRows(simulation.id).reduce<Record<string, string>>(
      (accumulator, oddsRow) => {
        accumulator[oddsRow.betLineLabel] = oddsRow.odds;
        return accumulator;
      },
      {},
    ),
    simulatedSlip: getSimulationSlipRecord(simulation.slipId),
  };
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
          placedDecimalOdds: simulation.simulatedSlip.placedDecimalOdds,
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
