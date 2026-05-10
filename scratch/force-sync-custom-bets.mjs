import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { createClient } from "@supabase/supabase-js";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");
const CUSTOM_BETS_FILE = path.join(REPO_ROOT, "data", "custom_bets.ts");
const CUSTOM_BET_OUTCOMES_FILE = path.join(REPO_ROOT, "data", "custom_bet_outcomes.ts");
const ENV_FILE = path.join(REPO_ROOT, ".env.local");

async function main() {
  const env = await loadEnv(ENV_FILE);
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY);

  const customBets = await loadTsExport(CUSTOM_BETS_FILE, "customBets");
  const outcomes = await loadTsExport(CUSTOM_BET_OUTCOMES_FILE, "customBetOutcomes");

  console.log(`Syncing ${customBets.length} custom bets...`);
  await syncTable(supabase, "custom_bets", customBets);

  console.log(`Syncing ${outcomes.length} custom bet outcomes...`);
  await syncTable(supabase, "custom_bet_outcomes", outcomes);

  console.log("Sync complete!");
}

async function syncTable(supabase, table, rows) {
  const payload = rows.map(mapRowToSupabaseShape);
  const { error } = await supabase.from(table).upsert(payload, { onConflict: "id" });
  if (error) throw new Error(`Failed to sync ${table}: ${error.message}`);
  console.log(`- Upserted ${payload.length} rows into ${table}`);
}

function mapRowToSupabaseShape(row) {
  return Object.fromEntries(
    Object.entries(row).map(([key, value]) => [
      toSnakeCase(key),
      value === undefined ? null : value,
    ])
  );
}

function toSnakeCase(value) {
  return value.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
}

async function loadTsExport(filePath, exportName) {
  const source = await readFile(filePath, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 },
    fileName: filePath,
  });
  const encodedSource = Buffer.from(transpiled.outputText, "utf8").toString("base64");
  const moduleUrl = `data:text/javascript;base64,${encodedSource}`;
  const module = await import(moduleUrl);
  return module[exportName] ?? [];
}

async function loadEnv(filePath) {
  const content = await readFile(filePath, "utf8");
  return Object.fromEntries(
    content.split("\n")
      .filter(line => line && !line.startsWith("#"))
      .map(line => {
        const [k, ...v] = line.split("=");
        return [k.trim(), v.join("=").trim().replace(/^['"]|['"]$/g, "")];
      })
  );
}

main().catch(console.error);
