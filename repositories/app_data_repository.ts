import { supabase } from "../lib/supabase/client";
import { getDefaultAppDataSnapshot } from "../services/app_data_service";
import type { AppDataSnapshot } from "../types/app_data_type";
import type { CustomBetRecord } from "../types/custom_bet_type";
import type { LeagueClubRecord } from "../types/league_club_type";
import type { MatchdayProposalRecord } from "../types/matchday_type";

type TableLoader = {
  tableName: string;
  snapshotKey: keyof AppDataSnapshot;
  optional?: boolean;
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
  { tableName: "custom_bets", snapshotKey: "customBets", optional: true },
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
  {
    tableName: "timeline_events",
    snapshotKey: "timelineEvents",
    optional: true,
  },
  {
    tableName: "matchday_outcomes",
    snapshotKey: "matchdayOutcomes",
    optional: true,
  },
  {
    tableName: "custom_bet_outcomes",
    snapshotKey: "customBetOutcomes",
    optional: true,
  },
  {
    tableName: "bet_learning_feedback",
    snapshotKey: "betLearningFeedback",
    optional: true,
  },
];

export async function loadRemoteAppDataSnapshot(): Promise<AppDataSnapshot> {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const supabaseClient = supabase;
  const fallbackSnapshot = getDefaultAppDataSnapshot();

  const loadedEntries = await Promise.all(
    TABLE_LOADERS.map(async ({ tableName, snapshotKey, optional }) => {
      const { data, error } = await supabaseClient.from(tableName).select("*");

      if (error) {
        if (optional && isMissingRelationError(error)) {
          return [snapshotKey, fallbackSnapshot[snapshotKey]] as const;
        }

        throw new Error(`Failed to load ${tableName}: ${error.message}`);
      }

      const mappedRows = (data ?? []).map(mapRemoteRowToAppShape);
      return [
        snapshotKey,
        resolveSnapshotRows(snapshotKey, mappedRows, fallbackSnapshot[snapshotKey]),
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

function resolveSnapshotRows(
  snapshotKey: keyof AppDataSnapshot,
  mappedRows: unknown[],
  fallbackRows: AppDataSnapshot[keyof AppDataSnapshot],
) {
  if (snapshotKey === "leagueClubs") {
    return mergeLeagueClubRows(
      mappedRows as LeagueClubRecord[],
      fallbackRows as LeagueClubRecord[],
    );
  }

  if (snapshotKey === "matchdayProposals") {
    return mergeMatchdayProposalRows(
      mappedRows as MatchdayProposalRecord[],
      fallbackRows as MatchdayProposalRecord[],
    );
  }

  if (snapshotKey === "customBets") {
    return mergeCustomBetRows(
      mappedRows as CustomBetRecord[],
      fallbackRows as CustomBetRecord[],
    );
  }

  return mappedRows.length > 0 ? mappedRows : fallbackRows;
}

function mergeLeagueClubRows(
  remoteRows: LeagueClubRecord[],
  fallbackRows: LeagueClubRecord[],
) {
  if (remoteRows.length === 0) {
    return fallbackRows;
  }

  const mergedRows = [...remoteRows];
  const seenNames = new Set(remoteRows.map((row) => row.name));

  for (const row of fallbackRows) {
    if (seenNames.has(row.name)) {
      continue;
    }

    mergedRows.push(row);
  }

  return mergedRows;
}

function mergeMatchdayProposalRows(
  remoteRows: MatchdayProposalRecord[],
  fallbackRows: MatchdayProposalRecord[],
) {
  if (remoteRows.length === 0) {
    return fallbackRows;
  }

  const fallbackRowsById = new Map(fallbackRows.map((row) => [row.id, row]));

  return remoteRows.map((row) => {
    const fallbackRow = fallbackRowsById.get(row.id);

    if (!fallbackRow) {
      return row;
    }

    return {
      ...fallbackRow,
      ...row,
      cashoutWatchList:
        row.cashoutWatchList && row.cashoutWatchList.length > 0
          ? row.cashoutWatchList
          : fallbackRow.cashoutWatchList,
    };
  });
}

function mergeCustomBetRows(
  remoteRows: CustomBetRecord[],
  fallbackRows: CustomBetRecord[],
) {
  if (remoteRows.length === 0) {
    return fallbackRows;
  }

  const mergedRows = [...remoteRows];
  const seenIds = new Set(remoteRows.map((row) => row.id));

  for (const row of fallbackRows) {
    if (seenIds.has(row.id)) {
      continue;
    }

    mergedRows.push(row);
  }

  return mergedRows;
}

function toCamelCase(value: string) {
  return value.replace(/_([a-z])/g, (_, character: string) => character.toUpperCase());
}

function isMissingRelationError(error: { code?: string; message?: string }) {
  const message = String(error.message ?? "").toLowerCase();

  return (
    error.code === "42P01" ||
    message.includes("does not exist") ||
    message.includes("schema cache") ||
    message.includes("could not find the table")
  );
}
