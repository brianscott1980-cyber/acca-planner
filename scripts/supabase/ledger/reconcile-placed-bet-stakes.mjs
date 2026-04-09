#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..", "..", "..");
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

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const [matchdayStakes, customBetStakes] = await Promise.all([
    loadMatchdayStakeRows(supabase),
    loadCustomBetStakeRows(supabase),
  ]);
  const payload = [...matchdayStakes, ...customBetStakes];

  if (payload.length === 0) {
    process.stdout.write("No placed bets found to reconcile.\n");
    return;
  }

  const { error } = await supabase
    .from("ledger_transactions")
    .upsert(payload, { onConflict: "id" });

  if (error) {
    throw new Error(`Failed to reconcile placed bet stakes: ${error.message}`);
  }

  process.stdout.write(
    `Reconciled ${payload.length} stake ledger rows (${matchdayStakes.length} matchday, ${customBetStakes.length} custom bet).\n`,
  );
}

async function loadMatchdayStakeRows(supabase) {
  const { data, error } = await supabase
    .from("league_data_slips")
    .select("game_week_id, proposal_id, stake, stake_placed_at")
    .not("game_week_id", "is", null)
    .not("stake_placed_at", "is", null)
    .gt("stake", 0);

  if (error) {
    throw new Error(`Failed to load placed matchday slips: ${error.message}`);
  }

  const nowIso = new Date().toISOString();
  return (data ?? []).map((row) => ({
    id: `stake-${row.game_week_id}`,
    title: "Market Bet Placed",
    date_iso: row.stake_placed_at,
    amount: -Math.abs(Number(row.stake ?? 0)),
    kind: "stake",
    game_week_id: row.game_week_id,
    proposal_id: row.proposal_id ?? null,
    custom_bet_id: null,
    updated_at: nowIso,
  }));
}

async function loadCustomBetStakeRows(supabase) {
  const { data, error } = await supabase
    .from("custom_bets")
    .select("*")
    .eq("state", "staked");

  if (error) {
    process.stdout.write(
      `Skipping custom bet stake reconciliation: ${error.message}\n`,
    );
    return [];
  }

  const rows = (data ?? [])
    .map((row) => {
      const stakeAmount = Number(
        row.stake_amount ?? row.suggested_stake_amount ?? row.stake ?? 0,
      );
      const isFreeStake = Boolean(
        row.is_free_stake || row.custom_bet_type === "free_bet_offer",
      );
      const placedAtIso =
        row.placed_at_iso ??
        row.generated_at_iso ??
        row.event_start_iso ??
        null;

      return {
        id: row.id,
        stakeAmount,
        isFreeStake,
        placedAtIso,
      };
    })
    .filter((row) => row.placedAtIso && (row.isFreeStake || row.stakeAmount > 0));

  const nowIso = new Date().toISOString();
  return rows.map((row) => ({
    id: `stake-custom-bet-${row.id}`,
    title: row.isFreeStake ? "Custom Bet Free Offer" : "Custom Bet Placed",
    date_iso: row.placedAtIso,
    amount: row.isFreeStake ? 0 : -Math.abs(row.stakeAmount),
    kind: "stake",
    game_week_id: null,
    proposal_id: null,
    custom_bet_id: row.id,
    updated_at: nowIso,
  }));
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
  console.error(error);
  process.exitCode = 1;
});
