#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..", "..", "..");
const DATA_DIR = path.join(REPO_ROOT, "data");
const ENV_FILES = [".env.local", ".env"];

const DATASETS = [
  {
    tableName: "users",
    fileName: "users.ts",
    exportName: "users",
    importType: "UserRecord",
    typePath: "../types/user_type",
  },
  {
    tableName: "league_clubs",
    fileName: "league_clubs.ts",
    exportName: "leagueClubs",
    importType: "LeagueClubRecord",
    typePath: "../types/league_club_type",
  },
  {
    tableName: "market_analysis_snapshots",
    fileName: "market_analysis_snapshots.ts",
    exportName: "marketAnalysisSnapshotRows",
    importType: "MarketAnalysisSnapshotRow",
    typePath: "../types/market_analysis_type",
  },
  {
    tableName: "market_analysis_selections",
    fileName: "market_analysis_selections.ts",
    exportName: "marketAnalysisSelectionRows",
    importType: "MarketAnalysisSelectionRow",
    typePath: "../types/market_analysis_type",
  },
  {
    tableName: "matchday_game_weeks",
    fileName: "matchday_game_weeks.ts",
    exportName: "matchdayGameWeeks",
    importType: "MatchdayGameWeekRecord",
    typePath: "../types/matchday_type",
  },
  {
    tableName: "matchday_proposals",
    fileName: "matchday_proposals.ts",
    exportName: "matchdayProposals",
    importType: "MatchdayProposalRecord",
    typePath: "../types/matchday_type",
  },
  {
    tableName: "matchday_bet_lines",
    fileName: "matchday_bet_lines.ts",
    exportName: "matchdayBetLines",
    importType: "MatchdayBetLineRecord",
    typePath: "../types/matchday_type",
  },
  {
    tableName: "matchday_forms",
    fileName: "matchday_forms.ts",
    exportName: "matchdayForms",
    importType: "MatchdayFormRecord",
    typePath: "../types/matchday_type",
  },
  {
    tableName: "matchday_form_matches",
    fileName: "matchday_form_matches.ts",
    exportName: "matchdayFormMatches",
    importType: "MatchdayFormMatchRecord",
    typePath: "../types/matchday_type",
  },
  {
    tableName: "custom_bets",
    fileName: "custom_bets.ts",
    exportName: "customBets",
    importType: "CustomBetRecord",
    typePath: "../types/custom_bet_type",
    optional: true,
  },
  {
    tableName: "league_data_meta",
    fileName: "league_data_meta.ts",
    exportName: "leagueDataMeta",
    importType: "LeagueDataMetaRecord",
    typePath: "../types/league_simulation_type",
  },
  {
    tableName: "league_data_matchday_simulations",
    fileName: "league_data_matchday_simulations.ts",
    exportName: "leagueDataMatchdaySimulations",
    importType: "LeagueMatchdaySimulationRow",
    typePath: "../types/league_simulation_type",
  },
  {
    tableName: "league_data_votes",
    fileName: "league_data_votes.ts",
    exportName: "leagueDataVotes",
    importType: "LeagueMatchdayVoteRow",
    typePath: "../types/league_simulation_type",
  },
  {
    tableName: "league_data_bet_line_odds",
    fileName: "league_data_bet_line_odds.ts",
    exportName: "leagueDataBetLineOdds",
    importType: "LeagueMatchdayBetLineOddsRow",
    typePath: "../types/league_simulation_type",
  },
  {
    tableName: "league_data_slips",
    fileName: "league_data_slips.ts",
    exportName: "leagueDataSlips",
    importType: "LeagueSimulationSlipRow",
    typePath: "../types/league_simulation_type",
  },
  {
    tableName: "league_data_leg_results",
    fileName: "league_data_leg_results.ts",
    exportName: "leagueDataLegResults",
    importType: "LeagueSimulationLegResultRow",
    typePath: "../types/league_simulation_type",
  },
  {
    tableName: "timeline_events",
    fileName: "timeline_events.ts",
    exportName: "timelineEvents",
    importType: "TimelineEventRecord",
    typePath: "../types/timeline_type",
    optional: true,
  },
  {
    tableName: "matchday_outcomes",
    fileName: "matchday_outcomes.ts",
    exportName: "matchdayOutcomes",
    importType: "MatchdayOutcomeRow",
    typePath: "../types/league_simulation_type",
    optional: true,
  },
  {
    tableName: "custom_bet_outcomes",
    fileName: "custom_bet_outcomes.ts",
    exportName: "customBetOutcomes",
    importType: "CustomBetOutcomeRow",
    typePath: "../types/league_simulation_type",
    optional: true,
  },
  {
    tableName: "bet_learning_feedback",
    fileName: "bet_learning_feedback.ts",
    exportName: "betLearningFeedback",
    importType: "BetLearningFeedbackRecord",
    typePath: "../types/bet_learning_feedback_type",
    optional: true,
  },
  {
    tableName: "matchday_seed",
    fileName: "matchday_seed.ts",
    exportName: "matchdaySeedGameWeeks",
    importType: "GameWeekRecord",
    typePath: "../types/matchday_type",
    optional: true,
  },
];

async function main() {
  await loadEnvironmentVariables();

  const supabase = createSupabaseAdminClient();
  await mkdir(DATA_DIR, { recursive: true });

  const writeResults = [];

  for (const dataset of DATASETS) {
    const rows = await fetchTableRows({
      supabase,
      tableName: dataset.tableName,
      optional: dataset.optional,
    });
    const normalizedRows = sortRows(rows.map((row) => mapRemoteRowToAppShape(row)));
    await writeDatasetFile({
      fileName: dataset.fileName,
      exportName: dataset.exportName,
      importType: dataset.importType,
      typePath: dataset.typePath,
      rows: normalizedRows,
    });
    writeResults.push({ fileName: dataset.fileName, count: normalizedRows.length });
  }

  const ledgerRows = await fetchLedgerRows(supabase);
  await writeDatasetFile({
    fileName: "ledger_data.ts",
    exportName: "ledgerData",
    importType: "LedgerTransactionRecord",
    typePath: "../types/ledger_type",
    rows: sortRows(ledgerRows.map((row) => mapRemoteRowToAppShape(row))),
  });
  writeResults.push({ fileName: "ledger_data.ts", count: ledgerRows.length });

  process.stdout.write("Updated local data files from Supabase:\n");
  for (const result of writeResults) {
    process.stdout.write(`- ${result.fileName}: ${result.count}\n`);
  }
}

async function fetchLedgerRows(supabase) {
  const fromTransactions = await fetchTableRows({
    supabase,
    tableName: "ledger_transactions",
    optional: true,
  });

  if (fromTransactions.length > 0) {
    return fromTransactions;
  }

  return fetchTableRows({
    supabase,
    tableName: "ledger_data",
    optional: true,
  });
}

async function fetchTableRows({ supabase, tableName, optional }) {
  const { data, error } = await supabase.from(tableName).select("*");

  if (error) {
    if (optional && isMissingRelationError(error)) {
      return [];
    }

    throw new Error(`Failed to load ${tableName}: ${error.message}`);
  }

  return data ?? [];
}

function sortRows(rows) {
  return [...rows].sort((left, right) => {
    const leftId = typeof left.id === "string" ? left.id : "";
    const rightId = typeof right.id === "string" ? right.id : "";

    if (leftId && rightId) {
      return leftId.localeCompare(rightId);
    }

    const leftDate = getSortableDate(left);
    const rightDate = getSortableDate(right);

    if (leftDate !== rightDate) {
      return leftDate.localeCompare(rightDate);
    }

    return JSON.stringify(left).localeCompare(JSON.stringify(right));
  });
}

function getSortableDate(row) {
  if (typeof row.dateIso === "string") {
    return row.dateIso;
  }
  if (typeof row.timestampIso === "string") {
    return row.timestampIso;
  }
  if (typeof row.updatedAtIso === "string") {
    return row.updatedAtIso;
  }
  return "";
}

async function writeDatasetFile({
  fileName,
  exportName,
  importType,
  typePath,
  rows,
}) {
  const fileContents = `import type { ${importType} } from "${typePath}";

export const ${exportName} = ${JSON.stringify(rows, null, 2)} as unknown as ${importType}[];
`;
  await writeFile(path.join(DATA_DIR, fileName), fileContents, "utf8");
}

function mapRemoteRowToAppShape(row) {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [toCamelCase(key), value]),
  );
}

function toCamelCase(value) {
  return value.replace(/_([a-z])/g, (_, character) => character.toUpperCase());
}

function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them to .env.local first.",
    );
  }

  if (supabaseUrl.includes("supabase.com/dashboard/project/")) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL must be your project API URL, for example https://your-project-ref.supabase.co, not the Supabase dashboard URL.",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

async function loadEnvironmentVariables() {
  for (const fileName of ENV_FILES) {
    const filePath = path.join(REPO_ROOT, fileName);

    try {
      const fileContents = await readFile(filePath, "utf8");
      applyEnvFile(fileContents);
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
        continue;
      }

      throw error;
    }
  }
}

function applyEnvFile(fileContents) {
  for (const rawLine of fileContents.split(/\r?\n/u)) {
    const line = rawLine.trim();

    if (!line || line.startsWith("#")) {
      continue;
    }

    const separatorIndex = line.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();

    if (!key || process.env[key]) {
      continue;
    }

    process.env[key] = stripWrappingQuotes(rawValue);
  }
}

function stripWrappingQuotes(value) {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function isMissingRelationError(error) {
  const message = String(error.message ?? "").toLowerCase();

  return (
    error.code === "42P01" ||
    message.includes("does not exist") ||
    message.includes("schema cache") ||
    message.includes("could not find the table")
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
