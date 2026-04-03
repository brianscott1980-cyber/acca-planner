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

  const placedDecimalOdds =
    typeof slipRow.placedDecimalOdds === "number" &&
    Number.isFinite(slipRow.placedDecimalOdds)
      ? slipRow.placedDecimalOdds
      : undefined;

  return {
    proposalId: slipRow.proposalId,
    timelineLabel: slipRow.timelineLabel,
    stake: slipRow.stake,
    placedDecimalOdds,
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
