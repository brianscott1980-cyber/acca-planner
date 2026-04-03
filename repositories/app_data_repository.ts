import { supabase } from "../lib/supabase/client";
import { getDefaultAppDataSnapshot } from "../services/app_data_service";
import type { AppDataSnapshot } from "../types/app_data_type";

type TableLoader = {
  tableName: string;
  snapshotKey: keyof AppDataSnapshot;
};

const TABLE_LOADERS: TableLoader[] = [
  { tableName: "users", snapshotKey: "users" },
  { tableName: "league_clubs", snapshotKey: "leagueClubs" },
  {
    tableName: "market_analysis_snapshots",
    snapshotKey: "marketAnalysisSnapshotRows",
  },
  {
    tableName: "market_analysis_selections",
    snapshotKey: "marketAnalysisSelectionRows",
  },
  { tableName: "matchday_game_weeks", snapshotKey: "matchdayGameWeeks" },
  { tableName: "matchday_proposals", snapshotKey: "matchdayProposals" },
  { tableName: "matchday_bet_lines", snapshotKey: "matchdayBetLines" },
  { tableName: "matchday_forms", snapshotKey: "matchdayForms" },
  { tableName: "matchday_form_matches", snapshotKey: "matchdayFormMatches" },
  { tableName: "league_data_meta", snapshotKey: "leagueDataMeta" },
  {
    tableName: "league_data_matchday_simulations",
    snapshotKey: "leagueDataMatchdaySimulations",
  },
  { tableName: "league_data_votes", snapshotKey: "leagueDataVotes" },
  {
    tableName: "league_data_bet_line_odds",
    snapshotKey: "leagueDataBetLineOdds",
  },
  { tableName: "league_data_slips", snapshotKey: "leagueDataSlips" },
  {
    tableName: "league_data_leg_results",
    snapshotKey: "leagueDataLegResults",
  },
  { tableName: "ledger_data", snapshotKey: "ledgerData" },
];

export async function loadRemoteAppDataSnapshot(): Promise<AppDataSnapshot> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const supabaseClient = supabase;
  const fallbackSnapshot = getDefaultAppDataSnapshot();

  const loadedEntries = await Promise.all(
    TABLE_LOADERS.map(async ({ tableName, snapshotKey }) => {
      const { data, error } = await supabaseClient.from(tableName).select("*");

      if (error) {
        throw new Error(`Failed to load ${tableName}: ${error.message}`);
      }

      const mappedRows = (data ?? []).map(mapRemoteRowToAppShape);
      return [
        snapshotKey,
        mappedRows.length > 0 ? mappedRows : fallbackSnapshot[snapshotKey],
      ] as const;
    }),
  );

  return Object.fromEntries(loadedEntries) as AppDataSnapshot;
}

function mapRemoteRowToAppShape(row: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [toCamelCase(key), value]),
  );
}

function toCamelCase(value: string) {
  return value.replace(/_([a-z])/g, (_, character: string) => character.toUpperCase());
}
