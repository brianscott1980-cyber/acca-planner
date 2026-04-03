import { leagueClubs } from "../data/league_clubs";
import { leagueDataBetLineOdds } from "../data/league_data_bet_line_odds";
import { leagueDataLegResults } from "../data/league_data_leg_results";
import { leagueDataMatchdaySimulations } from "../data/league_data_matchday_simulations";
import { leagueDataMeta } from "../data/league_data_meta";
import { leagueDataSlips } from "../data/league_data_slips";
import { leagueDataVotes } from "../data/league_data_votes";
import { ledgerData } from "../data/ledger_data";
import { marketAnalysisSelectionRows } from "../data/market_analysis_selections";
import { marketAnalysisSnapshotRows } from "../data/market_analysis_snapshots";
import { matchdayBetLines } from "../data/matchday_bet_lines";
import { matchdayFormMatches } from "../data/matchday_form_matches";
import { matchdayForms } from "../data/matchday_forms";
import { matchdayGameWeeks } from "../data/matchday_game_weeks";
import { matchdayProposals } from "../data/matchday_proposals";
import { timelineEvents } from "../data/timeline_events";
import { users } from "../data/users";
import type { AppDataSnapshot } from "../types/app_data_type";

export function getDefaultAppDataSnapshot(): AppDataSnapshot {
  return {
    users,
    leagueClubs,
    marketAnalysisSnapshotRows,
    marketAnalysisSelectionRows,
    matchdayGameWeeks,
    matchdayProposals,
    matchdayBetLines,
    matchdayForms,
    matchdayFormMatches,
    leagueDataMeta,
    leagueDataMatchdaySimulations,
    leagueDataVotes,
    leagueDataBetLineOdds,
    leagueDataSlips,
    leagueDataLegResults,
    ledgerData,
    timelineEvents,
  };
}

let currentAppDataSnapshot: AppDataSnapshot = getDefaultAppDataSnapshot();

export function getCurrentAppDataSnapshot() {
  return currentAppDataSnapshot;
}

export function setCurrentAppDataSnapshot(snapshot: AppDataSnapshot) {
  currentAppDataSnapshot = snapshot;
}

export function resetCurrentAppDataSnapshot() {
  currentAppDataSnapshot = getDefaultAppDataSnapshot();
}

export function getAppDataSourceMode() {
  return process.env.NEXT_PUBLIC_APP_DATA_SOURCE?.trim().toLowerCase() ?? "remote";
}

export function shouldUseLocalAppData() {
  return getAppDataSourceMode() === "local";
}

export function shouldUseRemoteAppData() {
  return !shouldUseLocalAppData();
}
