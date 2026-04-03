import { getCurrentAppDataSnapshot } from "../services/app_data_service";

export function getPrimaryLeagueDataMeta() {
  return getCurrentAppDataSnapshot().leagueDataMeta[0] ?? null;
}

export function getLeagueSimulatedAtIso() {
  return getPrimaryLeagueDataMeta()?.simulatedAtIso ?? new Date(0).toISOString();
}

export function getLeagueUpdatedAtIso() {
  return getPrimaryLeagueDataMeta()?.updatedAtIso ?? new Date(0).toISOString();
}
