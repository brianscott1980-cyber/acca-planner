import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { createClient } from "@supabase/supabase-js";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");
const LEDGER_FILE = path.join(REPO_ROOT, "data", "ledger_data.ts");
const ENV_FILE = path.join(REPO_ROOT, ".env.local");

async function main() {
  const env = await loadEnv(ENV_FILE);
  const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SECRET_KEY);

  const ledgerTransactions = await loadTsExport(LEDGER_FILE, "ledgerData");

  console.log("Clearing remote ledger_transactions...");
  const { error: clearError } = await supabase.from("ledger_transactions").delete().neq("id", "0");
  if (clearError) throw new Error(`Failed to clear ledger: ${clearError.message}`);

  console.log(`Syncing ${ledgerTransactions.length} clean ledger transactions...`);
  const payload = ledgerTransactions.map(entry => ({
    id: entry.id,
    title: entry.title,
    date_iso: entry.dateIso,
    amount: entry.amount,
    kind: entry.kind,
    game_week_id: entry.gameWeekId ?? null,
    proposal_id: entry.proposalId ?? null,
    custom_bet_id: entry.customBetId ?? null,
    updated_at: new Date().toISOString(),
  }));

  const { error: syncError } = await supabase.from("ledger_transactions").upsert(payload, { onConflict: "id" });
  if (syncError) throw new Error(`Failed to sync ledger: ${syncError.message}`);

  const total = ledgerTransactions.reduce((sum, t) => sum + t.amount, 0);
  console.log(`Total balance on Supabase now: £${total.toFixed(2)}`);
  console.log("Sync complete!");
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
