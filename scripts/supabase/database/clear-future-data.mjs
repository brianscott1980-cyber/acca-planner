#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..", "..");
const ENV_FILES = [".env.local", ".env"];

async function main() {
  const isDryRun = process.argv.includes("--dry-run");

  await loadEnvironmentVariables();

  const supabase = createSupabaseAdminClient();
  const nowIso = new Date().toISOString();

  const futureGameWeeks = await fetchRows(
    supabase,
    "matchday_game_weeks",
    "id, name, window_start_iso",
    (query) => query.gt("window_start_iso", nowIso).order("window_start_iso", { ascending: true }),
  );
  const futureGameWeekIds = getUniqueStringValues(futureGameWeeks, "id");

  const futureSeedIds = await fetchIds(
    supabase,
    "matchday_seed",
    (query) => query.gt("window_start_iso", nowIso),
  );
  const futureSnapshotIds = await fetchIdsByIn(
    supabase,
    "market_analysis_snapshots",
    "matchday_id",
    futureGameWeekIds,
  );
  const futureSelectionIds = await fetchIdsByIn(
    supabase,
    "market_analysis_selections",
    "snapshot_id",
    futureSnapshotIds,
  );
  const futureProposalIds = await fetchIdsByIn(
    supabase,
    "matchday_proposals",
    "game_week_id",
    futureGameWeekIds,
  );
  const futureBetLineIds = await fetchIdsByIn(
    supabase,
    "matchday_bet_lines",
    "game_week_id",
    futureGameWeekIds,
  );
  const futureFormIds = await fetchIdsByIn(
    supabase,
    "matchday_forms",
    "game_week_id",
    futureGameWeekIds,
  );
  const futureFormMatchIds = await fetchIdsByIn(
    supabase,
    "matchday_form_matches",
    "form_id",
    futureFormIds,
  );
  const futureSimulationIds = await fetchIdsByIn(
    supabase,
    "league_data_matchday_simulations",
    "game_week_id",
    futureGameWeekIds,
  );
  const futureVoteIds = await fetchIdsByIn(
    supabase,
    "league_data_votes",
    "game_week_id",
    futureGameWeekIds,
  );
  const futureBetLineOddsIds = await fetchIdsByIn(
    supabase,
    "league_data_bet_line_odds",
    "game_week_id",
    futureGameWeekIds,
  );
  const futureSlipIds = await fetchIdsByIn(
    supabase,
    "league_data_slips",
    "game_week_id",
    futureGameWeekIds,
  );
  const futureLegResultIds = await fetchIdsByIn(
    supabase,
    "league_data_leg_results",
    "game_week_id",
    futureGameWeekIds,
  );
  const futureLedgerDataIds = getUniqueValues([
    ...(await fetchIds(
      supabase,
      "ledger_data",
      (query) => query.gt("date_iso", nowIso),
    )),
  ]);
  const futureLedgerTransactionIds = getUniqueValues([
    ...(await fetchIds(
      supabase,
      "ledger_transactions",
      (query) => query.gt("date_iso", nowIso),
    )),
  ]);
  const futureTimelineEventIds = getUniqueValues([
    ...(await fetchIdsByOptionalQuery(
      supabase,
      "timeline_events",
      (query) => query.gt("timestamp_iso", nowIso),
    )),
    ...(await fetchIdsByOptionalIn(
      supabase,
      "timeline_events",
      "matchday_id",
      futureGameWeekIds,
    )),
  ]);
  const futureMatchdayVoteCount = await fetchCountByIn(
    supabase,
    "matchday_votes",
    "game_week_id",
    futureGameWeekIds,
  );

  const operations = [
    { table: "matchday_form_matches", ids: futureFormMatchIds },
    { table: "league_data_leg_results", ids: futureLegResultIds },
    { table: "league_data_votes", ids: futureVoteIds },
    { table: "league_data_bet_line_odds", ids: futureBetLineOddsIds },
    { table: "league_data_slips", ids: futureSlipIds },
    { table: "matchday_votes", column: "game_week_id", values: futureGameWeekIds, count: futureMatchdayVoteCount },
    { table: "ledger_transactions", ids: futureLedgerTransactionIds },
    { table: "ledger_data", ids: futureLedgerDataIds },
    { table: "timeline_events", ids: futureTimelineEventIds },
    { table: "league_data_matchday_simulations", ids: futureSimulationIds },
    { table: "matchday_forms", ids: futureFormIds },
    { table: "matchday_bet_lines", ids: futureBetLineIds },
    { table: "matchday_proposals", ids: futureProposalIds },
    { table: "market_analysis_selections", ids: futureSelectionIds },
    { table: "market_analysis_snapshots", ids: futureSnapshotIds },
    { table: "matchday_seed", ids: futureSeedIds },
    { table: "matchday_game_weeks", ids: futureGameWeekIds },
  ].map((operation) => ({
    ...operation,
    count:
      operation.count ??
      (Array.isArray(operation.ids)
        ? operation.ids.length
        : Array.isArray(operation.values)
        ? operation.values.length
        : 0),
  }));

  const totalRowsToDelete = operations.reduce((sum, operation) => sum + operation.count, 0);

  if (futureGameWeeks.length === 0 && totalRowsToDelete === 0) {
    process.stdout.write("No future Supabase rows were found to clear.\n");
    return;
  }

  process.stdout.write(
    `${isDryRun ? "Dry run" : "Preparing"} future Supabase cleanup as of ${nowIso}.\n`,
  );

  if (futureGameWeeks.length > 0) {
    process.stdout.write("\nFuture matchdays:\n");
    for (const gameWeek of futureGameWeeks) {
      process.stdout.write(
        `- ${gameWeek.name ?? gameWeek.id} (${gameWeek.id}) starts ${gameWeek.window_start_iso ?? "unknown"}\n`,
      );
    }
  }

  process.stdout.write("\nRows matched for cleanup:\n");
  for (const operation of operations) {
    if (operation.count === 0) {
      continue;
    }

    process.stdout.write(`- ${operation.table}: ${operation.count}\n`);
  }

  process.stdout.write(`\nTotal rows matched: ${totalRowsToDelete}\n`);

  if (isDryRun) {
    process.stdout.write("\nDry run only. No rows were deleted.\n");
    return;
  }

  for (const operation of operations) {
    if (operation.count === 0) {
      continue;
    }

    if (Array.isArray(operation.ids)) {
      await deleteByIds(supabase, operation.table, operation.ids);
      continue;
    }

    if (Array.isArray(operation.values) && operation.column) {
      await deleteByColumnValues(
        supabase,
        operation.table,
        operation.column,
        operation.values,
      );
    }
  }

  process.stdout.write("\nFuture Supabase rows deleted successfully.\n");
}

function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY). Add them to .env.local first.",
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

async function fetchRows(supabase, table, columns, buildQuery) {
  const query = buildQuery(supabase.from(table).select(columns));
  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to list ${table}: ${error.message}`);
  }

  return data ?? [];
}

async function fetchIds(supabase, table, buildQuery) {
  const rows = await fetchRows(supabase, table, "id", buildQuery);
  return getUniqueStringValues(rows, "id");
}

async function fetchIdsByIn(supabase, table, column, values) {
  if (values.length === 0) {
    return [];
  }

  return fetchIds(supabase, table, (query) => query.in(column, values));
}

async function fetchIdsByOptionalIn(supabase, table, column, values) {
  if (values.length === 0) {
    return [];
  }

  const { data, error } = await supabase.from(table).select("id").in(column, values);

  if (error) {
    if (isMissingColumnError(error, table, column)) {
      process.stdout.write(
        `Skipping ${table}.${column} matchday filtering because that column is not present in the live schema.\n`,
      );
      return [];
    }

    throw new Error(`Failed to list ${table}: ${error.message}`);
  }

  return getUniqueStringValues(data ?? [], "id");
}

async function fetchIdsByOptionalQuery(supabase, table, buildQuery) {
  const { data, error } = await buildQuery(supabase.from(table).select("id"));

  if (error) {
    if (isMissingRelationError(error)) {
      process.stdout.write(
        `Skipping ${table} because that table is not present in the live schema.\n`,
      );
      return [];
    }

    throw new Error(`Failed to list ${table}: ${error.message}`);
  }

  return getUniqueStringValues(data ?? [], "id");
}

async function fetchCountByIn(supabase, table, column, values) {
  if (values.length === 0) {
    return 0;
  }

  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true })
    .in(column, values);

  if (error) {
    throw new Error(`Failed to count ${table}: ${error.message}`);
  }

  return count ?? 0;
}

async function deleteByIds(supabase, table, ids) {
  if (ids.length === 0) {
    return;
  }

  const { error } = await supabase.from(table).delete().in("id", ids);

  if (error) {
    throw new Error(`Failed to delete ${table}: ${error.message}`);
  }
}

async function deleteByColumnValues(supabase, table, column, values) {
  if (values.length === 0) {
    return;
  }

  const { error } = await supabase.from(table).delete().in(column, values);

  if (error) {
    throw new Error(`Failed to delete ${table}: ${error.message}`);
  }
}

function getUniqueStringValues(rows, key) {
  return getUniqueValues(
    rows
      .map((row) => row?.[key])
      .filter((value) => typeof value === "string"),
  );
}

function getUniqueValues(values) {
  return [...new Set(values)];
}

function isMissingColumnError(error, table, column) {
  return (
    error?.code === "42703" ||
    String(error?.message ?? "").includes(`column ${table}.${column} does not exist`)
  );
}

function isMissingRelationError(error) {
  return (
    error?.code === "42P01" ||
    String(error?.message ?? "").toLowerCase().includes("does not exist")
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
