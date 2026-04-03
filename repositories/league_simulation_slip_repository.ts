import { leagueDataLegResults } from "../data/league_data_leg_results";
import { leagueDataSlips } from "../data/league_data_slips";

export function getLeagueSimulationSlipRowById(slipId: string) {
  return leagueDataSlips.find((slip) => slip.id === slipId) ?? null;
}

export function getLeagueSimulationLegResultRowsBySlipId(slipId: string) {
  return leagueDataLegResults
    .filter((legRow) => legRow.slipId === slipId)
    .sort((left, right) => left.order - right.order);
}
