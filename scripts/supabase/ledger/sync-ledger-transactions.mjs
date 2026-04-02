#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { createClient } from "@supabase/supabase-js";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..", "..");
const LEDGER_FILE = path.join(REPO_ROOT, "data", "ledger_data.ts");
const ENV_FILES = [".env.local", ".env"];

async function main() {
  await loadEnvironmentVariables();

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

  const ledgerTransactions = await loadLedgerTransactions();
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const payload = ledgerTransactions.map((entry) => ({
    id: entry.id,
    title: entry.title,
    date_iso: entry.dateIso,
    amount: entry.amount,
    kind: entry.kind,
    game_week_id: entry.gameWeekId ?? null,
    proposal_id: entry.proposalId ?? null,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase.from("ledger_transactions").upsert(payload, {
    onConflict: "id",
  });

  if (error) {
    throw new Error(`Failed to sync ledger transactions: ${error.message}`);
  }

  process.stdout.write(
    `Synced ${ledgerTransactions.length} ledger transactions to Supabase.\n`,
  );
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

async function loadLedgerTransactions() {
  const source = await readFile(LEDGER_FILE, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: LEDGER_FILE,
  });
  const encodedSource = Buffer.from(transpiled.outputText, "utf8").toString("base64");
  const moduleUrl = `data:text/javascript;base64,${encodedSource}`;
  const importedModule = await import(moduleUrl);

  return importedModule.ledgerData ?? [];
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
