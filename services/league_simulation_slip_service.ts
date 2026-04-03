import {
  getLeagueSimulationLegResultRowsBySlipId,
  getLeagueSimulationSlipRowById,
} from "../repositories/league_simulation_slip_repository";
import type { LeagueSimulationSlipRecord } from "../types/league_simulation_type";

export function getSimulationSlipRecord(slipId: string): LeagueSimulationSlipRecord {
  const slipRow = getLeagueSimulationSlipRowById(slipId);

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
    placedDecimalOdds: slipRow.placedDecimalOdds,
    stakePlacedAt: slipRow.stakePlacedAt,
    settledAt: slipRow.settledAt,
    settlementKind: slipRow.settlementKind,
    returnAmount: slipRow.returnAmount,
    status: slipRow.status,
    legResults: getLeagueSimulationLegResultRowsBySlipId(slipId).map((legRow) => ({
      betLineLabel: legRow.betLineLabel,
      kickoffAt: legRow.kickoffAt,
      settledAt: legRow.settledAt,
      finalScore: legRow.finalScore,
      status: legRow.status,
      actualStatus: legRow.actualStatus,
    })),
  };
}
