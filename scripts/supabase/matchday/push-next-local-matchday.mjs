#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { createInterface } from "node:readline/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { createClient } from "@supabase/supabase-js";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../../..");
const DATA_DIR = path.join(REPO_ROOT, "data");
const ENV_FILES = [".env.local", ".env"];
const CLEAR_FUTURE_SCRIPT = path.join(
  REPO_ROOT,
  "scripts",
  "supabase",
  "database",
  "clear-future-data.mjs",
);
const VOTE_HANDLING_MODES = new Set(["clear", "retain", "cancel"]);

const DATASETS = {
  matchdayGameWeeks: {
    fileName: "matchday_game_weeks.ts",
    exportName: "matchdayGameWeeks",
    tableName: "matchday_game_weeks",
  },
  marketAnalysisSnapshotRows: {
    fileName: "market_analysis_snapshots.ts",
    exportName: "marketAnalysisSnapshotRows",
    tableName: "market_analysis_snapshots",
  },
  marketAnalysisSelectionRows: {
    fileName: "market_analysis_selections.ts",
    exportName: "marketAnalysisSelectionRows",
    tableName: "market_analysis_selections",
  },
  matchdayProposals: {
    fileName: "matchday_proposals.ts",
    exportName: "matchdayProposals",
    tableName: "matchday_proposals",
  },
  matchdayBetLines: {
    fileName: "matchday_bet_lines.ts",
    exportName: "matchdayBetLines",
    tableName: "matchday_bet_lines",
  },
  matchdayForms: {
    fileName: "matchday_forms.ts",
    exportName: "matchdayForms",
    tableName: "matchday_forms",
  },
  matchdayFormMatches: {
    fileName: "matchday_form_matches.ts",
    exportName: "matchdayFormMatches",
    tableName: "matchday_form_matches",
  },
  timelineEvents: {
    fileName: "timeline_events.ts",
    exportName: "timelineEvents",
    tableName: "timeline_events",
    optional: true,
  },
};

async function main() {
  const { isDryRun, voteHandlingMode } = parseArgs(process.argv.slice(2));

  await loadEnvironmentVariables();

  const supabase = createSupabaseAdminClient();
  const datasets = await loadDatasets();
  const nextGameWeek = getNextLocalGameWeek(datasets.matchdayGameWeeks);

  if (!nextGameWeek) {
    throw new Error(
      "No upcoming local matchday was found in data/matchday_game_weeks.ts. Generate the next local matchday first.",
    );
  }

  const target = collectTargetRows(datasets, nextGameWeek.id);
  const remoteExisting = await fetchRemoteTargetState(supabase, nextGameWeek.id);
  const resolvedVoteHandlingMode = await resolveVoteHandlingMode({
    gameWeek: nextGameWeek,
    remoteExisting,
    presetMode: voteHandlingMode,
  });

  process.stdout.write(
    `${isDryRun ? "Dry run" : "Preparing"} remote reset-and-publish for ${nextGameWeek.name} (${nextGameWeek.id}).\n`,
  );
  process.stdout.write(
    `Window: ${nextGameWeek.windowStartIso} -> ${nextGameWeek.windowEndIso}\n`,
  );
  process.stdout.write("\nLocal rows selected for publish:\n");
  for (const [label, rows] of Object.entries(target.summary)) {
    process.stdout.write(`- ${label}: ${rows}\n`);
  }

  if (resolvedVoteHandlingMode === "cancel") {
    process.stdout.write(
      `\nCancelled because ${remoteExisting.matchdayVoteCount} remote vote(s) already exist for ${nextGameWeek.id}.\n`,
    );
    return;
  }

  if (remoteExisting.matchdayVoteCount > 0) {
    process.stdout.write(
      `\nVote handling: ${
        resolvedVoteHandlingMode === "retain"
          ? "replace rows and retain existing votes"
          : "replace rows and clear existing votes"
      }.\n`,
    );
  }

  process.stdout.write("\nRunning supabase:clear-future first.\n");
  await runNodeScript(CLEAR_FUTURE_SCRIPT, getClearFutureArgs({
    isDryRun,
    gameWeekId: nextGameWeek.id,
    voteHandlingMode: resolvedVoteHandlingMode,
  }));

  if (isDryRun) {
    process.stdout.write(
      "\nDry run only. Future cleanup was previewed and no remote rows were inserted.\n",
    );
    return;
  }

  const publishTarget =
    resolvedVoteHandlingMode === "retain"
      ? applyRetainedVotesToTarget(target, remoteExisting.matchdayVotes)
      : target;

  await resetRemoteTargetState(supabase, nextGameWeek.id, remoteExisting, {
    retainVotes: resolvedVoteHandlingMode === "retain",
  });
  await upsertTargetRows(supabase, publishTarget);

  process.stdout.write(
    `\nPublished ${nextGameWeek.id} from local files to Supabase successfully.\n`,
  );
}

async function loadDatasets() {
  const entries = await Promise.all(
    Object.entries(DATASETS).map(async ([key, config]) => [key, await loadTsExport(config)]),
  );

  return Object.fromEntries(entries);
}

async function loadTsExport(config) {
  const sourcePath = path.join(DATA_DIR, config.fileName);
  const source = await readFile(sourcePath, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: sourcePath,
  });
  const encodedSource = Buffer.from(transpiled.outputText, "utf8").toString("base64");
  const moduleUrl = `data:text/javascript;base64,${encodedSource}`;
  const importedModule = await import(moduleUrl);

  return importedModule[config.exportName] ?? [];
}

function getNextLocalGameWeek(gameWeeks) {
  const now = Date.now();

  return gameWeeks
    // Include the currently live matchday as a valid publish target.
    // This allows syncing "today's" card after kickoff has started.
    .filter((entry) => new Date(entry.windowEndIso).getTime() > now)
    .sort(
      (left, right) =>
        new Date(left.windowStartIso).getTime() - new Date(right.windowStartIso).getTime(),
    )[0] ?? null;
}

function collectTargetRows(datasets, gameWeekId) {
  const gameWeekRows = datasets.matchdayGameWeeks.filter((entry) => entry.id === gameWeekId);
  const snapshotRows = datasets.marketAnalysisSnapshotRows.filter(
    (entry) => entry.matchdayId === gameWeekId,
  );
  const snapshotIds = new Set(snapshotRows.map((entry) => entry.id));
  const selectionRows = datasets.marketAnalysisSelectionRows.filter((entry) =>
    snapshotIds.has(entry.snapshotId),
  );
  const proposalRows = datasets.matchdayProposals.filter(
    (entry) => entry.gameWeekId === gameWeekId,
  );
  const proposalIds = new Set(proposalRows.map((entry) => entry.id));
  const betLineRows = datasets.matchdayBetLines.filter(
    (entry) => entry.gameWeekId === gameWeekId || proposalIds.has(entry.proposalEntityId),
  );
  const betLineIds = new Set(betLineRows.map((entry) => entry.id));
  const formRows = datasets.matchdayForms.filter(
    (entry) => entry.gameWeekId === gameWeekId || betLineIds.has(entry.betLineId),
  );
  const formIds = new Set(formRows.map((entry) => entry.id));
  const formMatchRows = datasets.matchdayFormMatches.filter((entry) =>
    formIds.has(entry.formId),
  );
  const timelineRows = datasets.timelineEvents.filter((entry) => entry.matchdayId === gameWeekId);

  return {
    gameWeekRows,
    snapshotRows,
    selectionRows,
    proposalRows,
    betLineRows,
    formRows,
    formMatchRows,
    timelineRows,
    summary: {
      "matchday_game_weeks": gameWeekRows.length,
      "market_analysis_snapshots": snapshotRows.length,
      "market_analysis_selections": selectionRows.length,
      "matchday_proposals": proposalRows.length,
      "matchday_bet_lines": betLineRows.length,
      "matchday_forms": formRows.length,
      "matchday_form_matches": formMatchRows.length,
      "timeline_events": timelineRows.length,
    },
  };
}

async function fetchRemoteTargetState(supabase, gameWeekId) {
  const formIds = await fetchIdsByIn(supabase, "matchday_forms", "game_week_id", [gameWeekId]);
  const snapshotIds = await fetchIdsByIn(
    supabase,
    "market_analysis_snapshots",
    "matchday_id",
    [gameWeekId],
  );

  return {
    formMatchIds: await fetchIdsByIn(
      supabase,
      "matchday_form_matches",
      "form_id",
      formIds,
    ),
    formIds,
    betLineIds: await fetchIdsByIn(supabase, "matchday_bet_lines", "game_week_id", [gameWeekId]),
    proposalIds: await fetchIdsByIn(supabase, "matchday_proposals", "game_week_id", [gameWeekId]),
    selectionIds: await fetchIdsByIn(
      supabase,
      "market_analysis_selections",
      "snapshot_id",
      snapshotIds,
    ),
    snapshotIds,
    timelineEventIds: await fetchIdsByOptionalIn(
      supabase,
      "timeline_events",
      "matchday_id",
      [gameWeekId],
    ),
    matchdayVotes: await fetchRows(
      supabase,
      "matchday_votes",
      "member_id, proposal_id",
      (query) => query.eq("game_week_id", gameWeekId),
      true,
    ),
    matchdayVoteCount: await fetchCountByOptionalIn(
      supabase,
      "matchday_votes",
      "game_week_id",
      [gameWeekId],
    ),
  };
}

async function resetRemoteTargetState(
  supabase,
  gameWeekId,
  remoteExisting,
  { retainVotes = false } = {},
) {
  process.stdout.write("\nResetting existing remote rows for the target matchday.\n");

  const operations = [
    { table: "matchday_form_matches", ids: remoteExisting.formMatchIds },
    ...(!retainVotes
      ? [
          {
            table: "matchday_votes",
            column: "game_week_id",
            values: [gameWeekId],
            count: remoteExisting.matchdayVoteCount,
            optional: true,
          },
        ]
      : []),
    { table: "timeline_events", ids: remoteExisting.timelineEventIds, optional: true },
    { table: "matchday_forms", ids: remoteExisting.formIds },
    { table: "matchday_bet_lines", ids: remoteExisting.betLineIds },
    { table: "matchday_proposals", ids: remoteExisting.proposalIds },
    { table: "market_analysis_selections", ids: remoteExisting.selectionIds },
    { table: "market_analysis_snapshots", ids: remoteExisting.snapshotIds },
  ];

  for (const operation of operations) {
    if ((operation.count ?? operation.ids?.length ?? operation.values?.length ?? 0) === 0) {
      continue;
    }

    if (Array.isArray(operation.ids)) {
      await deleteByIds(supabase, operation.table, operation.ids, operation.optional);
      continue;
    }

    if (Array.isArray(operation.values) && operation.column) {
      await deleteByColumnValues(
        supabase,
        operation.table,
        operation.column,
        operation.values,
        operation.optional,
      );
    }
  }
}

async function upsertTargetRows(supabase, target) {
  process.stdout.write("\nPublishing local next-matchday rows to Supabase.\n");

  const steps = [
    {
      table: DATASETS.matchdayGameWeeks.tableName,
      rows: target.gameWeekRows,
    },
    {
      table: DATASETS.marketAnalysisSnapshotRows.tableName,
      rows: target.snapshotRows,
    },
    {
      table: DATASETS.marketAnalysisSelectionRows.tableName,
      rows: target.selectionRows,
    },
    {
      table: DATASETS.matchdayProposals.tableName,
      rows: target.proposalRows,
    },
    {
      table: DATASETS.matchdayBetLines.tableName,
      rows: target.betLineRows,
    },
    {
      table: DATASETS.matchdayForms.tableName,
      rows: target.formRows,
    },
    {
      table: DATASETS.matchdayFormMatches.tableName,
      rows: target.formMatchRows,
    },
    {
      table: DATASETS.timelineEvents.tableName,
      rows: target.timelineRows,
      optional: true,
    },
  ];

  for (const step of steps) {
    if (step.rows.length === 0) {
      continue;
    }

    let payload = step.rows.map(mapRowToSupabaseShape);
    let { error } = await supabase.from(step.table).upsert(payload, {
      onConflict: "id",
    });

    if (
      error &&
      step.table === DATASETS.matchdayProposals.tableName &&
      isMissingColumnError(error, "cashout_watch_list")
    ) {
      payload = payload.map((row) => omitKeys(row, ["cashout_watch_list"]));
      ({ error } = await supabase.from(step.table).upsert(payload, {
        onConflict: "id",
      }));
    }

    if (error) {
      if (step.optional && isMissingRelationError(error)) {
        process.stdout.write(
          `Skipping ${step.table} because that table is not present in the live schema.\n`,
        );
        continue;
      }

      throw new Error(`Failed to upsert ${step.table}: ${error.message}`);
    }

    process.stdout.write(`- Upserted ${payload.length} row(s) into ${step.table}.\n`);
  }
}

function mapRowToSupabaseShape(row) {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      toSnakeCase(key),
      value === undefined ? null : value,
    ]),
  );
}

function toSnakeCase(value) {
  return value.replace(/[A-Z]/g, (character) => `_${character.toLowerCase()}`);
}

function omitKeys(row, keys) {
  const nextRow = { ...row };

  for (const key of keys) {
    delete nextRow[key];
  }

  return nextRow;
}

function isMissingColumnError(error, columnName) {
  return (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message.includes(`'${columnName}' column`)
  );
}

async function runNodeScript(scriptPath, args) {
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [scriptPath, ...args], {
      cwd: REPO_ROOT,
      stdio: "inherit",
    });

    child.on("exit", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${path.basename(scriptPath)} exited with code ${code ?? 1}.`));
    });
    child.on("error", reject);
  });
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

function parseArgs(args) {
  let isDryRun = false;
  let voteHandlingMode = null;

  for (const arg of args) {
    if (arg === "--dry-run") {
      isDryRun = true;
      continue;
    }

    if (arg === "--replace-clear-votes") {
      voteHandlingMode = "clear";
      continue;
    }

    if (arg === "--replace-retain-votes") {
      voteHandlingMode = "retain";
      continue;
    }

    if (arg === "--cancel-on-votes") {
      voteHandlingMode = "cancel";
      continue;
    }

    if (arg.startsWith("--on-existing-votes=")) {
      const nextMode = arg.split("=")[1]?.trim().toLowerCase() ?? "";

      if (!VOTE_HANDLING_MODES.has(nextMode)) {
        throw new Error(
          `Unsupported --on-existing-votes value "${nextMode}". Use clear, retain, or cancel.`,
        );
      }

      voteHandlingMode = nextMode;
    }
  }

  return {
    isDryRun,
    voteHandlingMode,
  };
}

async function resolveVoteHandlingMode({
  gameWeek,
  remoteExisting,
  presetMode,
}) {
  if (remoteExisting.matchdayVoteCount === 0) {
    return "clear";
  }

  if (presetMode) {
    return presetMode;
  }

  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error(
      `Remote votes already exist for ${gameWeek.id}. Re-run with --replace-clear-votes, --replace-retain-votes, or --cancel-on-votes.`,
    );
  }

  process.stdout.write(
    `\nWarning: ${remoteExisting.matchdayVoteCount} remote vote(s) already exist for ${gameWeek.name} (${gameWeek.id}).\n`,
  );
  process.stdout.write("Choose how to continue:\n");
  process.stdout.write("  1. Replace and clear votes\n");
  process.stdout.write("  2. Replace and retain votes\n");
  process.stdout.write("  3. Cancel\n");

  const readline = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    while (true) {
      const answer = (await readline.question("Select 1, 2, or 3: ")).trim();

      if (answer === "1") {
        return "clear";
      }

      if (answer === "2") {
        return "retain";
      }

      if (answer === "3") {
        return "cancel";
      }

      process.stdout.write("Please enter 1, 2, or 3.\n");
    }
  } finally {
    readline.close();
  }
}

function getClearFutureArgs({ isDryRun, gameWeekId, voteHandlingMode }) {
  const args = [];

  if (isDryRun) {
    args.push("--dry-run");
  }

  if (voteHandlingMode === "retain") {
    args.push(`--exclude-game-week=${gameWeekId}`);
  }

  return args;
}

function applyRetainedVotesToTarget(target, matchdayVotes) {
  const validProposalIds = new Set(target.proposalRows.map((row) => row.proposalId));
  const retainedVotesByUserId = {};
  let droppedVoteCount = 0;

  for (const voteRow of matchdayVotes) {
    if (!validProposalIds.has(voteRow.proposal_id)) {
      droppedVoteCount += 1;
      continue;
    }

    retainedVotesByUserId[voteRow.member_id] = voteRow.proposal_id;
  }

  if (droppedVoteCount > 0) {
    process.stdout.write(
      `Dropping ${droppedVoteCount} retained vote(s) that do not match the current local proposal ids.\n`,
    );
  }

  return {
    ...target,
    gameWeekRows: target.gameWeekRows.map((row) => ({
      ...row,
      votesByUserId: retainedVotesByUserId,
    })),
  };
}

async function fetchRows(supabase, table, columns, buildQuery, optional = false) {
  const query = buildQuery(supabase.from(table).select(columns));
  const { data, error } = await query;

  if (error) {
    if (optional && isMissingRelationError(error)) {
      return [];
    }

    throw new Error(`Failed to list ${table}: ${error.message}`);
  }

  return data ?? [];
}

async function fetchIdsByIn(supabase, table, column, values) {
  if (values.length === 0) {
    return [];
  }

  const rows = await fetchRows(
    supabase,
    table,
    "id",
    (query) => query.in(column, values),
  );

  return getUniqueStringValues(rows, "id");
}

async function fetchIdsByOptionalIn(supabase, table, column, values) {
  if (values.length === 0) {
    return [];
  }

  const rows = await fetchRows(
    supabase,
    table,
    "id",
    (query) => query.in(column, values),
    true,
  );

  return getUniqueStringValues(rows, "id");
}

async function fetchCountByOptionalIn(supabase, table, column, values) {
  if (values.length === 0) {
    return 0;
  }

  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true })
    .in(column, values);

  if (error) {
    if (isMissingRelationError(error)) {
      return 0;
    }

    throw new Error(`Failed to count ${table}: ${error.message}`);
  }

  return count ?? 0;
}

async function deleteByIds(supabase, table, ids, optional = false) {
  if (ids.length === 0) {
    return;
  }

  const { error } = await supabase.from(table).delete().in("id", ids);

  if (error) {
    if (optional && isMissingRelationError(error)) {
      return;
    }

    throw new Error(`Failed to delete ${table}: ${error.message}`);
  }

  process.stdout.write(`- Deleted ${ids.length} existing row(s) from ${table}.\n`);
}

async function deleteByColumnValues(
  supabase,
  table,
  column,
  values,
  optional = false,
) {
  if (values.length === 0) {
    return;
  }

  const { error } = await supabase.from(table).delete().in(column, values);

  if (error) {
    if (optional && isMissingRelationError(error)) {
      return;
    }

    throw new Error(`Failed to delete ${table}: ${error.message}`);
  }

  process.stdout.write(
    `- Deleted existing row(s) from ${table} where ${column} matched ${values.join(", ")}.\n`,
  );
}

function getUniqueStringValues(rows, key) {
  return [...new Set(rows.map((row) => row?.[key]).filter((value) => typeof value === "string"))];
}

function isMissingRelationError(error) {
  return (
    error?.code === "42P01" ||
    String(error?.message ?? "").toLowerCase().includes("does not exist") ||
    String(error?.message ?? "").toLowerCase().includes("could not find the table")
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
