#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../../..");
const DATA_DIR = path.join(REPO_ROOT, "data");
const OUTPUT_SCHEMA_FILE = path.join(SCRIPT_DIR, "database_schema.sql");
const OUTPUT_SEED_FILE = path.join(SCRIPT_DIR, "database_seed_data.sql");
const ADMIN_WRITE_TABLES = new Set([
  "matchday_game_weeks",
  "league_data_meta",
  "league_data_matchday_simulations",
  "league_data_votes",
  "league_data_slips",
]);

const DATASETS = [
  {
    fileName: "users.ts",
    exportName: "users",
    tableName: "users",
    fieldNames: [
      "id",
      "firstName",
      "lastName",
      "displayName",
      "initials",
      "joinedOn",
      "role",
      "email",
    ],
    primaryKey: ["id"],
    uniqueKeys: [["email"]],
    columns: {
      joinedOn: { type: "date" },
      role: { type: "text", check: ["member", "admin"] },
    },
  },
  {
    fileName: "league_clubs.ts",
    exportName: "leagueClubs",
    tableName: "league_clubs",
    fieldNames: ["name", "slug", "badgePath", "badgeSourceUrl"],
    primaryKey: ["slug"],
    uniqueKeys: [["name"]],
  },
  {
    fileName: "matchday_game_weeks.ts",
    exportName: "matchdayGameWeeks",
    tableName: "matchday_game_weeks",
    fieldNames: [
      "id",
      "slug",
      "name",
      "description",
      "windowStartIso",
      "windowEndIso",
      "startsIn",
      "proposalIds",
      "votesByUserId",
      "simulatedSlip",
    ],
    primaryKey: ["id"],
    columns: {
      windowStartIso: { type: "timestamptz" },
      windowEndIso: { type: "timestamptz" },
      proposalIds: { type: "jsonb" },
      votesByUserId: { type: "jsonb" },
      simulatedSlip: { type: "jsonb" },
    },
  },
  {
    fileName: "market_analysis_snapshots.ts",
    exportName: "marketAnalysisSnapshotRows",
    tableName: "market_analysis_snapshots",
    fieldNames: ["id", "bookmaker", "snapshotDate", "matchdayId"],
    primaryKey: ["id"],
    foreignKeys: [
      {
        columns: ["matchdayId"],
        referenceTable: "matchday_game_weeks",
        referenceColumns: ["id"],
      },
    ],
    columns: {
      snapshotDate: { type: "date" },
      bookmaker: { type: "text", check: ["Ladbrokes"] },
    },
  },
  {
    fileName: "market_analysis_selections.ts",
    exportName: "marketAnalysisSelectionRows",
    tableName: "market_analysis_selections",
    fieldNames: ["id", "snapshotId", "fixture", "market", "selection", "decimalOdds"],
    primaryKey: ["id"],
    foreignKeys: [
      {
        columns: ["snapshotId"],
        referenceTable: "market_analysis_snapshots",
        referenceColumns: ["id"],
      },
    ],
    columns: {
      decimalOdds: { type: "numeric(10, 2)" },
    },
  },
  {
    fileName: "matchday_proposals.ts",
    exportName: "matchdayProposals",
    tableName: "matchday_proposals",
    fieldNames: [
      "id",
      "gameWeekId",
      "proposalId",
      "riskLevel",
      "title",
      "summary",
      "legs",
      "statusLabel",
      "betLineIds",
      "aiRecommended",
    ],
    primaryKey: ["id"],
    uniqueKeys: [["gameWeekId", "proposalId"]],
    foreignKeys: [
      {
        columns: ["gameWeekId"],
        referenceTable: "matchday_game_weeks",
        referenceColumns: ["id"],
      },
    ],
    columns: {
      riskLevel: { type: "text", check: ["safe", "balanced", "aggressive"] },
      betLineIds: { type: "jsonb" },
    },
  },
  {
    fileName: "matchday_bet_lines.ts",
    exportName: "matchdayBetLines",
    tableName: "matchday_bet_lines",
    fieldNames: [
      "id",
      "gameWeekId",
      "proposalEntityId",
      "sortOrder",
      "label",
      "scheduleNote",
      "aiReasoning",
      "formId",
      "formNote",
      "marketId",
      "odds",
    ],
    primaryKey: ["id"],
    foreignKeys: [
      {
        columns: ["gameWeekId"],
        referenceTable: "matchday_game_weeks",
        referenceColumns: ["id"],
      },
      {
        columns: ["proposalEntityId"],
        referenceTable: "matchday_proposals",
        referenceColumns: ["id"],
      },
      {
        columns: ["marketId"],
        referenceTable: "market_analysis_selections",
        referenceColumns: ["id"],
      },
    ],
    columns: {
      sortOrder: { type: "integer" },
    },
  },
  {
    fileName: "matchday_forms.ts",
    exportName: "matchdayForms",
    tableName: "matchday_forms",
    fieldNames: ["id", "gameWeekId", "proposalId", "betLineId"],
    primaryKey: ["id"],
    foreignKeys: [
      {
        columns: ["gameWeekId"],
        referenceTable: "matchday_game_weeks",
        referenceColumns: ["id"],
      },
      {
        columns: ["betLineId"],
        referenceTable: "matchday_bet_lines",
        referenceColumns: ["id"],
      },
    ],
  },
  {
    fileName: "matchday_form_matches.ts",
    exportName: "matchdayFormMatches",
    tableName: "matchday_form_matches",
    fieldNames: [
      "id",
      "formId",
      "teamSide",
      "sortOrder",
      "opponent",
      "venue",
      "finalScore",
      "goalsScored",
      "outcome",
    ],
    primaryKey: ["id"],
    foreignKeys: [
      {
        columns: ["formId"],
        referenceTable: "matchday_forms",
        referenceColumns: ["id"],
      },
    ],
    columns: {
      sortOrder: { type: "integer" },
      teamSide: { type: "text", check: ["home", "away"] },
      venue: { type: "text", check: ["H", "A"] },
      goalsScored: { type: "integer" },
      outcome: { type: "text", check: ["W", "D", "L"] },
    },
  },
  {
    fileName: "league_data_meta.ts",
    exportName: "leagueDataMeta",
    tableName: "league_data_meta",
    fieldNames: ["id", "simulatedAtIso", "updatedAtIso"],
    primaryKey: ["id"],
    columns: {
      simulatedAtIso: { type: "timestamptz" },
      updatedAtIso: { type: "timestamptz" },
    },
  },
  {
    fileName: "league_data_matchday_simulations.ts",
    exportName: "leagueDataMatchdaySimulations",
    tableName: "league_data_matchday_simulations",
    fieldNames: [
      "id",
      "gameWeekId",
      "voteResolvedAtIso",
      "betPlacedAtIso",
      "selectedProposalId",
      "slipId",
    ],
    primaryKey: ["id"],
    uniqueKeys: [["gameWeekId"]],
    foreignKeys: [
      {
        columns: ["gameWeekId"],
        referenceTable: "matchday_game_weeks",
        referenceColumns: ["id"],
      },
    ],
    columns: {
      voteResolvedAtIso: { type: "timestamptz" },
      betPlacedAtIso: { type: "timestamptz" },
    },
  },
  {
    fileName: "league_data_votes.ts",
    exportName: "leagueDataVotes",
    tableName: "league_data_votes",
    fieldNames: ["id", "simulationId", "gameWeekId", "userId", "proposalId"],
    primaryKey: ["id"],
    uniqueKeys: [["simulationId", "userId"]],
    foreignKeys: [
      {
        columns: ["simulationId"],
        referenceTable: "league_data_matchday_simulations",
        referenceColumns: ["id"],
      },
      {
        columns: ["gameWeekId"],
        referenceTable: "matchday_game_weeks",
        referenceColumns: ["id"],
      },
      {
        columns: ["userId"],
        referenceTable: "users",
        referenceColumns: ["id"],
      },
    ],
  },
  {
    fileName: "league_data_bet_line_odds.ts",
    exportName: "leagueDataBetLineOdds",
    tableName: "league_data_bet_line_odds",
    fieldNames: ["id", "simulationId", "gameWeekId", "sortOrder", "betLineLabel", "odds"],
    primaryKey: ["id"],
    foreignKeys: [
      {
        columns: ["simulationId"],
        referenceTable: "league_data_matchday_simulations",
        referenceColumns: ["id"],
      },
      {
        columns: ["gameWeekId"],
        referenceTable: "matchday_game_weeks",
        referenceColumns: ["id"],
      },
    ],
    columns: {
      sortOrder: { type: "integer" },
      odds: { type: "numeric(10, 2)" },
    },
  },
  {
    fileName: "league_data_slips.ts",
    exportName: "leagueDataSlips",
    tableName: "league_data_slips",
    fieldNames: [
      "id",
      "simulationId",
      "gameWeekId",
      "proposalId",
      "timelineLabel",
      "stake",
      "stakePlacedAt",
      "settledAt",
      "settlementKind",
      "returnAmount",
      "status",
    ],
    primaryKey: ["id"],
    foreignKeys: [
      {
        columns: ["simulationId"],
        referenceTable: "league_data_matchday_simulations",
        referenceColumns: ["id"],
      },
      {
        columns: ["gameWeekId"],
        referenceTable: "matchday_game_weeks",
        referenceColumns: ["id"],
      },
    ],
    columns: {
      stake: { type: "numeric(12, 2)" },
      stakePlacedAt: { type: "timestamptz" },
      settledAt: { type: "timestamptz" },
      settlementKind: { type: "text", check: ["settled", "cashout"] },
      returnAmount: { type: "numeric(12, 2)" },
      status: { type: "text", check: ["win", "loss"] },
    },
  },
  {
    fileName: "league_data_leg_results.ts",
    exportName: "leagueDataLegResults",
    tableName: "league_data_leg_results",
    fieldNames: [
      "id",
      "simulationId",
      "slipId",
      "gameWeekId",
      "sortOrder",
      "betLineLabel",
      "kickoffAt",
      "settledAt",
      "finalScore",
      "status",
      "actualStatus",
    ],
    primaryKey: ["id"],
    foreignKeys: [
      {
        columns: ["simulationId"],
        referenceTable: "league_data_matchday_simulations",
        referenceColumns: ["id"],
      },
      {
        columns: ["slipId"],
        referenceTable: "league_data_slips",
        referenceColumns: ["id"],
      },
      {
        columns: ["gameWeekId"],
        referenceTable: "matchday_game_weeks",
        referenceColumns: ["id"],
      },
    ],
    columns: {
      sortOrder: { type: "integer" },
      kickoffAt: { type: "timestamptz" },
      settledAt: { type: "timestamptz" },
      status: { type: "text", check: ["won", "lost", "cashed_out"] },
      actualStatus: { type: "text", check: ["won", "lost"] },
    },
  },
  {
    fileName: "ledger_data.ts",
    exportName: "ledgerData",
    tableName: "ledger_data",
    fieldNames: ["id", "title", "dateIso", "amount", "kind", "gameWeekId", "proposalId"],
    primaryKey: ["id"],
    columns: {
      dateIso: { type: "timestamptz" },
      amount: { type: "numeric(12, 2)" },
      kind: { type: "text", check: ["deposit", "stake", "settlement"] },
    },
    foreignKeys: [
      {
        columns: ["gameWeekId"],
        referenceTable: "matchday_game_weeks",
        referenceColumns: ["id"],
      },
    ],
  },
  {
    fileName: "timeline_events.ts",
    exportName: "timelineEvents",
    tableName: "timeline_events",
    fieldNames: ["id", "title", "description", "timestampIso", "kind", "matchdayId"],
    primaryKey: ["id"],
    columns: {
      timestampIso: { type: "timestamptz" },
      kind: { type: "text", check: ["matchday_proposal_generated"] },
    },
    foreignKeys: [
      {
        columns: ["matchdayId"],
        referenceTable: "matchday_game_weeks",
        referenceColumns: ["id"],
      },
    ],
  },
  {
    fileName: "matchday_seed.ts",
    exportName: "matchdaySeedGameWeeks",
    tableName: "matchday_seed",
    fieldNames: [
      "id",
      "slug",
      "name",
      "description",
      "windowStartIso",
      "windowEndIso",
      "startsIn",
      "proposals",
      "votesByUserId",
      "simulatedSlip",
    ],
    primaryKey: ["id"],
    columns: {
      windowStartIso: { type: "timestamptz" },
      windowEndIso: { type: "timestamptz" },
      proposals: { type: "jsonb" },
      votesByUserId: { type: "jsonb" },
      simulatedSlip: { type: "jsonb" },
    },
  },
];

async function main() {
  const datasets = [];

  for (const config of DATASETS) {
    const rows = await loadTsExport(config.fileName, config.exportName);
    datasets.push({
      ...config,
      rows,
    });
  }

  await mkdir(SCRIPT_DIR, { recursive: true });
  await writeFile(OUTPUT_SCHEMA_FILE, renderSchemaSql(datasets));
  await writeFile(OUTPUT_SEED_FILE, renderSeedSql(datasets));

  process.stdout.write(
    `Generated ${path.relative(REPO_ROOT, OUTPUT_SCHEMA_FILE)} and ${path.relative(REPO_ROOT, OUTPUT_SEED_FILE)}.\n`,
  );
}

async function loadTsExport(fileName, exportName) {
  const filePath = path.join(DATA_DIR, fileName);
  const source = await readFile(filePath, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filePath,
  });
  const encodedSource = Buffer.from(transpiled.outputText, "utf8").toString("base64");
  const moduleUrl = `data:text/javascript;base64,${encodedSource}`;
  const importedModule = await import(moduleUrl);

  if (!Array.isArray(importedModule[exportName])) {
    throw new Error(`Expected ${fileName} to export array ${exportName}.`);
  }

  return importedModule[exportName];
}

function renderSchemaSql(datasets) {
  const statements = [
    "-- Generated by scripts/supabase/database/generate-database-sql.mjs",
    "-- Creates relational tables that mirror the current data/*.ts files.",
    "",
  ];

  for (const dataset of datasets) {
    statements.push(renderCreateTable(dataset));
    statements.push("");
    statements.push(`alter table public.${dataset.tableName} enable row level security;`);
    statements.push("");
  }

  statements.push("grant usage on schema public to authenticated;");
  statements.push("");

  for (const dataset of datasets) {
    statements.push(renderReadAccessStatements(dataset));
    statements.push("");

    if (ADMIN_WRITE_TABLES.has(dataset.tableName)) {
      statements.push(renderAdminWriteStatements(dataset));
      statements.push("");
    }
  }

  return `${statements.join("\n").trim()}\n`;
}

function renderCreateTable(dataset) {
  const columns = collectColumns(dataset);
  const columnDefinitions = columns.map((column) =>
    `  ${column.columnName} ${column.sqlType}${column.notNull ? " not null" : ""}${column.checkClause ? ` ${column.checkClause}` : ""}`,
  );

  if (dataset.primaryKey?.length) {
    columnDefinitions.push(
      `  primary key (${dataset.primaryKey.map((key) => toSnakeCase(key)).join(", ")})`,
    );
  }

  for (const uniqueKey of dataset.uniqueKeys ?? []) {
    columnDefinitions.push(
      `  unique (${uniqueKey.map((key) => toSnakeCase(key)).join(", ")})`,
    );
  }

  for (const foreignKey of dataset.foreignKeys ?? []) {
    const presentColumns = foreignKey.columns.filter((column) =>
      columns.some((candidate) => candidate.propertyName === column),
    );

    if (presentColumns.length !== foreignKey.columns.length) {
      continue;
    }

    columnDefinitions.push(
      `  foreign key (${presentColumns.map((column) => toSnakeCase(column)).join(", ")}) references public.${foreignKey.referenceTable} (${foreignKey.referenceColumns
        .map((column) => toSnakeCase(column))
        .join(", ")})`,
    );
  }

  return `create table if not exists public.${dataset.tableName} (\n${columnDefinitions.join(",\n")}\n);`;
}

function renderReadAccessStatements(dataset) {
  const policyName = `Authenticated users can read ${dataset.tableName}`;

  return [
    `grant select on public.${dataset.tableName} to authenticated;`,
    `drop policy if exists "${policyName}" on public.${dataset.tableName};`,
    `create policy "${policyName}"`,
    `on public.${dataset.tableName}`,
    "for select",
    "to authenticated",
    "using (true);",
  ].join("\n");
}

function renderSeedSql(datasets) {
  const statements = [
    "-- Generated by scripts/supabase/database/generate-database-sql.mjs",
    "-- Seeds the relational tables from the current data/*.ts files.",
    "",
  ];

  for (const dataset of datasets) {
    statements.push(renderInsertStatement(dataset));
    statements.push("");
  }

  return `${statements.join("\n").trim()}\n`;
}

function renderInsertStatement(dataset) {
  if (dataset.rows.length === 0) {
    return `-- No seed rows for public.${dataset.tableName}.`;
  }

  const columns = collectColumns(dataset);
  const sqlColumns = columns.map((column) => column.columnName);
  const rows = dataset.rows.map((row) =>
    `  (${columns
      .map((column) => toSqlValue(row[column.propertyName], column.sqlType))
      .join(", ")})`,
  );

  if (!dataset.primaryKey?.length) {
    throw new Error(
      `Dataset ${dataset.tableName} must define a primary key for seed conflict handling.`,
    );
  }

  const conflictColumns = dataset.primaryKey;

  return `insert into public.${dataset.tableName} (${sqlColumns.join(", ")})\nvalues\n${rows.join(",\n")}\non conflict (${conflictColumns.map((column) => toSnakeCase(column)).join(", ")}) do nothing;`;
}

function collectColumns(dataset) {
  const propertyNames = [...(dataset.fieldNames ?? [])];

  for (const row of dataset.rows) {
    for (const key of Object.keys(row)) {
      if (!propertyNames.includes(key)) {
        propertyNames.push(key);
      }
    }
  }

  return propertyNames.map((propertyName) => {
    const override = dataset.columns?.[propertyName] ?? {};
    const values = dataset.rows.map((row) => row[propertyName]).filter((value) => value !== undefined);
    const notNull =
      override.notNull ??
      dataset.primaryKey?.includes(propertyName) ??
      (dataset.rows.length > 0 &&
        values.length === dataset.rows.length &&
        !values.some((value) => value === null));

    return {
      propertyName,
      columnName: toSnakeCase(propertyName),
      sqlType: override.type ?? inferSqlType(values, propertyName),
      notNull,
      checkClause: override.check
        ? `check (${toSnakeCase(propertyName)} in (${override.check.map((value) => `'${escapeSqlString(value)}'`).join(", ")}))`
        : "",
    };
  });
}

function renderAdminWriteStatements(dataset) {
  const adminCheckExpression =
    "coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'";
  const insertPolicyName = `Authenticated admins can insert ${dataset.tableName}`;
  const updatePolicyName = `Authenticated admins can update ${dataset.tableName}`;

  return [
    `grant insert, update on public.${dataset.tableName} to authenticated;`,
    `drop policy if exists "${insertPolicyName}" on public.${dataset.tableName};`,
    `create policy "${insertPolicyName}"`,
    `on public.${dataset.tableName}`,
    "for insert",
    "to authenticated",
    `with check (${adminCheckExpression});`,
    `drop policy if exists "${updatePolicyName}" on public.${dataset.tableName};`,
    `create policy "${updatePolicyName}"`,
    `on public.${dataset.tableName}`,
    "for update",
    "to authenticated",
    `using (${adminCheckExpression})`,
    `with check (${adminCheckExpression});`,
  ].join("\n");
}

function inferSqlType(values, propertyName) {
  if (values.length === 0) {
    return "text";
  }

  if (values.every((value) => Array.isArray(value) || isPlainObject(value))) {
    return "jsonb";
  }

  if (values.every((value) => typeof value === "boolean")) {
    return "boolean";
  }

  if (values.every((value) => typeof value === "number")) {
    return values.every((value) => Number.isInteger(value))
      ? "integer"
      : "numeric(12, 2)";
  }

  if (values.every((value) => typeof value === "string")) {
    const lowerName = propertyName.toLowerCase();

    if (lowerName.endsWith("iso") || lowerName.endsWith("at")) {
      return "timestamptz";
    }

    if (
      lowerName.endsWith("date") ||
      lowerName === "joinedon" ||
      values.every((value) => /^\d{4}-\d{2}-\d{2}$/.test(value))
    ) {
      return "date";
    }

    return "text";
  }

  return "jsonb";
}

function toSqlValue(value, sqlType) {
  if (value === undefined || value === null) {
    return "null";
  }

  if (sqlType === "jsonb") {
    return `'${escapeSqlString(JSON.stringify(value))}'::jsonb`;
  }

  if (sqlType.startsWith("numeric") || sqlType === "integer") {
    return `${value}`;
  }

  if (sqlType === "boolean") {
    return value ? "true" : "false";
  }

  return `'${escapeSqlString(String(value))}'`;
}

function escapeSqlString(value) {
  return value.replace(/'/g, "''");
}

function toSnakeCase(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .toLowerCase();
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
