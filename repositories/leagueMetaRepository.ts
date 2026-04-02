import { leagueDataMeta } from "../data/league_data_meta";

export function getPrimaryLeagueDataMeta() {
  return leagueDataMeta[0] ?? null;
}

export function getLeagueSimulatedAtIso() {
  return getPrimaryLeagueDataMeta()?.simulatedAtIso ?? new Date(0).toISOString();
}

export function getLeagueUpdatedAtIso() {
  return getPrimaryLeagueDataMeta()?.updatedAtIso ?? new Date(0).toISOString();
}
