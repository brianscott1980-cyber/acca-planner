import { persistEndedMatchdayVotingRemote } from "../repositories/matchday_admin_repository";
import {
  getCurrentAppDataSnapshot,
  setCurrentAppDataSnapshot,
  shouldUseRemoteAppData,
} from "./app_data_service";
import { getRecommendedStake } from "./game_week_service";
import type { AppDataSnapshot } from "../types/app_data_type";
import type {
  LeagueDataMetaRecord,
  LeagueMatchdaySimulationRow,
  LeagueMatchdayVoteRow,
  LeagueSimulationSlipRow,
} from "../types/league_simulation_type";
import type { GameWeekProposalRecord, GameWeekRecord } from "../types/matchday_type";

const LOCKED_STAGE_BUFFER_MS = 1000 * 60 * 60 * 24 * 7;
const LOCKED_SETTLEMENT_BUFFER_MS = LOCKED_STAGE_BUFFER_MS * 2;

export async function endMatchdayVoting(gameWeek: GameWeekRecord) {
  const selectedProposal = getSelectedProposalForEndedVoting(gameWeek);

  if (!selectedProposal) {
    throw new Error("No proposal is available to lock for this matchday.");
  }

  const currentSnapshot = getCurrentAppDataSnapshot();
  const nowIso = new Date().toISOString();
  const simulationId = `simulation-${gameWeek.id}`;
  const slipId = `slip-${gameWeek.id}`;
  const betPlacedAtIso = new Date(Date.now() + LOCKED_STAGE_BUFFER_MS).toISOString();
  const settledAtIso = new Date(Date.now() + LOCKED_SETTLEMENT_BUFFER_MS).toISOString();
  const metaBase = currentSnapshot.leagueDataMeta[0];
  const metaRow: LeagueDataMetaRecord = {
    id: metaBase?.id ?? "primary",
    simulatedAtIso: metaBase?.simulatedAtIso ?? nowIso,
    updatedAtIso: nowIso,
  };
  const simulationRow: LeagueMatchdaySimulationRow = {
    id: simulationId,
    gameWeekId: gameWeek.id,
    voteResolvedAtIso: nowIso,
    betPlacedAtIso,
    selectedProposalId: selectedProposal.id,
    slipId,
  };
  const slipRow: LeagueSimulationSlipRow = {
    id: slipId,
    simulationId,
    gameWeekId: gameWeek.id,
    proposalId: selectedProposal.id,
    timelineLabel: selectedProposal.title,
    stake: getRecommendedStake(gameWeek, selectedProposal),
    stakePlacedAt: betPlacedAtIso,
    settledAt: settledAtIso,
    settlementKind: "settled",
    returnAmount: 0,
    status: "loss",
  };
  const voteRows: LeagueMatchdayVoteRow[] = Object.entries(gameWeek.votesByUserId).map(
    ([userId, proposalId]) => ({
      id: `${simulationId}:${userId}`,
      simulationId,
      gameWeekId: gameWeek.id,
      userId,
      proposalId,
    }),
  );

  if (shouldUseRemoteAppData()) {
    await persistEndedMatchdayVotingRemote({
      gameWeekId: gameWeek.id,
      votesByUserId: gameWeek.votesByUserId,
      metaRow,
      simulationRow,
      slipRow,
      voteRows,
    });
  }

  const nextSnapshot = applyEndedVotingToSnapshot({
    snapshot: currentSnapshot,
    gameWeek,
    metaRow,
    simulationRow,
    slipRow,
    voteRows,
  });

  setCurrentAppDataSnapshot(nextSnapshot);

  return {
    selectedProposal,
  };
}

function getSelectedProposalForEndedVoting(gameWeek: GameWeekRecord) {
  const voteCounts = new Map<string, number>();

  for (const proposalId of Object.values(gameWeek.votesByUserId)) {
    voteCounts.set(proposalId, (voteCounts.get(proposalId) ?? 0) + 1);
  }

  const sortedProposals = [...gameWeek.proposals].sort((left, right) => {
    const rightVotes = voteCounts.get(right.id) ?? 0;
    const leftVotes = voteCounts.get(left.id) ?? 0;

    if (rightVotes !== leftVotes) {
      return rightVotes - leftVotes;
    }

    if (Boolean(right.aiRecommended) !== Boolean(left.aiRecommended)) {
      return Number(Boolean(left.aiRecommended)) - Number(Boolean(right.aiRecommended));
    }

    return left.legs - right.legs;
  });

  return sortedProposals[0] ?? null;
}

function applyEndedVotingToSnapshot({
  snapshot,
  gameWeek,
  metaRow,
  simulationRow,
  slipRow,
  voteRows,
}: {
  snapshot: AppDataSnapshot;
  gameWeek: GameWeekRecord;
  metaRow: LeagueDataMetaRecord;
  simulationRow: LeagueMatchdaySimulationRow;
  slipRow: LeagueSimulationSlipRow;
  voteRows: LeagueMatchdayVoteRow[];
}) {
  return {
    ...snapshot,
    matchdayGameWeeks: snapshot.matchdayGameWeeks.map((gameWeekRow) =>
      gameWeekRow.id === gameWeek.id
        ? {
            ...gameWeekRow,
            votesByUserId: gameWeek.votesByUserId,
          }
        : gameWeekRow,
    ),
    leagueDataMeta: upsertById(snapshot.leagueDataMeta, metaRow),
    leagueDataMatchdaySimulations: upsertById(
      snapshot.leagueDataMatchdaySimulations.filter(
        (existingRow) => existingRow.gameWeekId !== gameWeek.id,
      ),
      simulationRow,
    ),
    leagueDataSlips: upsertById(
      snapshot.leagueDataSlips.filter((existingRow) => existingRow.gameWeekId !== gameWeek.id),
      slipRow,
    ),
    leagueDataVotes: [
      ...snapshot.leagueDataVotes.filter(
        (existingRow) => existingRow.gameWeekId !== gameWeek.id,
      ),
      ...voteRows,
    ],
  };
}

function upsertById<TRecord extends { id: string }>(rows: TRecord[], row: TRecord) {
  const withoutExistingRow = rows.filter((existingRow) => existingRow.id !== row.id);
  return [...withoutExistingRow, row];
}
