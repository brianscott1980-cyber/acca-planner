import type { LeagueSimulationLegStatus } from "../data/league_data_entities";
import { leagueDataLegResults } from "../data/league_data_leg_results";
import { leagueDataSlips } from "../data/league_data_slips";

export type LeagueSimulationLegRecord = {
  betLineLabel: string;
  kickoffAt: string;
  settledAt: string;
  finalScore: string;
  status: LeagueSimulationLegStatus;
  actualStatus: "won" | "lost";
};

export type LeagueSimulationSlipRecord = {
  proposalId: string;
  timelineLabel: string;
  stake: number;
  stakePlacedAt: string;
  settledAt: string;
  settlementKind: "settled" | "cashout";
  returnAmount: number;
  status: "win" | "loss";
  legResults: LeagueSimulationLegRecord[];
};

const slipRowsById = new Map(leagueDataSlips.map((slip) => [slip.id, slip]));

export function getSimulationSlipRecord(slipId: string): LeagueSimulationSlipRecord {
  const slipRow = slipRowsById.get(slipId);

  if (!slipRow) {
    return {
      proposalId: "",
      timelineLabel: "",
      stake: 0,
      stakePlacedAt: "",
      settledAt: "",
      settlementKind: "settled",
      returnAmount: 0,
      status: "loss",
      legResults: [],
    };
  }

  return {
    proposalId: slipRow.proposalId,
    timelineLabel: slipRow.timelineLabel,
    stake: slipRow.stake,
    stakePlacedAt: slipRow.stakePlacedAt,
    settledAt: slipRow.settledAt,
    settlementKind: slipRow.settlementKind,
    returnAmount: slipRow.returnAmount,
    status: slipRow.status,
    legResults: leagueDataLegResults
      .filter((legRow) => legRow.slipId === slipId)
      .sort((left, right) => left.order - right.order)
      .map((legRow) => ({
        betLineLabel: legRow.betLineLabel,
        kickoffAt: legRow.kickoffAt,
        settledAt: legRow.settledAt,
        finalScore: legRow.finalScore,
        status: legRow.status,
        actualStatus: legRow.actualStatus,
      })),
  };
}
