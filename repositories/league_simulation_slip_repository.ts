import { getCurrentAppDataSnapshot } from "../services/app_data_service";

export function getLeagueSimulationSlipRowById(slipId: string) {
  return getCurrentAppDataSnapshot().leagueDataSlips.find((slip) => slip.id === slipId) ?? null;
}

export function getLeagueSimulationLegResultRowsBySlipId(slipId: string) {
  return getCurrentAppDataSnapshot().leagueDataLegResults
    .filter((legRow) => legRow.slipId === slipId)
    .sort((left, right) => left.sortOrder - right.sortOrder);
}
