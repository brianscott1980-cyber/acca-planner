#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { createClient } from "@supabase/supabase-js";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../../..");
const DATA_FILE = path.join(REPO_ROOT, "data", "custom_bets.ts");
const ENV_FILES = [".env.local", ".env"];

async function main() {
  const isDryRun = process.argv.includes("--dry-run");

  await loadEnvironmentVariables();

  const supabase = createSupabaseAdminClient();
  const customBets = await loadTsExport({
    sourcePath: DATA_FILE,
    exportName: "customBets",
  });
  const nowIso = new Date().toISOString();
  const futureCustomBets = customBets.filter(
    (entry) => new Date(entry.eventStartIso).getTime() > Date.parse(nowIso),
  );

  process.stdout.write(
    `${isDryRun ? "Dry run" : "Preparing"} custom bet sync as of ${nowIso}.\n`,
  );
  process.stdout.write(`Future local custom bets selected: ${futureCustomBets.length}\n`);

  if (futureCustomBets.length === 0) {
    process.stdout.write("No future local custom bets were found to sync.\n");
    return;
  }

  for (const customBet of futureCustomBets) {
    process.stdout.write(`- ${customBet.title} (${customBet.id}) starts ${customBet.eventStartIso}\n`);
  }

  const remoteFutureIds = await fetchOptionalIds(
    supabase,
    "custom_bets",
    (query) => query.gt("event_start_iso", nowIso),
  );

  process.stdout.write(`Future remote custom bets matched for replacement: ${remoteFutureIds.length}\n`);

  if (isDryRun) {
    process.stdout.write("Dry run only. No remote rows were changed.\n");
    return;
  }

  if (remoteFutureIds.length > 0) {
    const { error } = await supabase.from("custom_bets").delete().in("id", remoteFutureIds);

    if (error) {
      throw new Error(`Failed to clear future remote custom bets: ${error.message}`);
    }
  }

  const payload = customBets.map(mapRowToSupabaseShape);
  const { error } = await supabase.from("custom_bets").upsert(payload, {
    onConflict: "id",
  });

  if (error) {
    throw new Error(`Failed to upsert custom_bets: ${error.message}`);
  }

  process.stdout.write(`Synced ${payload.length} custom bet row(s) to Supabase.\n`);
}

async function loadTsExport({ sourcePath, exportName }) {
  const source = await readFile(sourcePath, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: sourcePath,
  });
  const encodedSource = Buffer.from(transpiled.outputText, "utf8").toString("base64");
  const importedModule = await import(`data:text/javascript;base64,${encodedSource}`);

  return importedModule[exportName] ?? [];
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

async function fetchOptionalIds(supabase, table, buildQuery) {
  const { data, error } = await buildQuery(supabase.from(table).select("id"));

  if (error) {
    if (isMissingRelationError(error)) {
      process.stdout.write(
        `Skipping remote ${table} lookup because that table is not present in the live schema.\n`,
      );
      return [];
    }

    throw new Error(`Failed to list ${table}: ${error.message}`);
  }

  return [...new Set((data ?? []).map((row) => row.id).filter((id) => typeof id === "string"))];
}

function isMissingRelationError(error) {
  return (
    error?.code === "42P01" ||
    String(error?.message ?? "").toLowerCase().includes("does not exist")
  );
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

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
