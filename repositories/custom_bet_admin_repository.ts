"use client";

import { supabase } from "../lib/supabase/client";
import type { CustomBetRecord } from "../types/custom_bet_type";
import type { LedgerTransactionRecord } from "../types/ledger_type";
import type { CustomBetOutcomeRow } from "../types/league_simulation_type";

export async function persistCustomBetRemote(customBet: CustomBetRecord) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { error } = await supabase
    .from("custom_bets")
    .upsert(mapKeysToSnakeCase(customBet), { onConflict: "id" });

  if (error) {
    throw new Error(`Failed to persist custom bet ${customBet.id}: ${error.message}`);
  }
}

export async function persistCustomBetStakeLedgerRemote(
  stakeLedgerRow: LedgerTransactionRecord,
) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { error } = await supabase
    .from("ledger_transactions")
    .upsert(mapKeysToSnakeCase(stakeLedgerRow), { onConflict: "id" });

  if (error) {
    throw new Error(`Failed to upsert custom bet stake ledger: ${error.message}`);
  }
}

export async function persistCustomBetOutcomeRemote({
  outcomeRow,
  stakeLedgerRow,
  settlementLedgerRow,
}: {
  outcomeRow: CustomBetOutcomeRow;
  stakeLedgerRow: LedgerTransactionRecord | null;
  settlementLedgerRow: LedgerTransactionRecord | null;
}) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { error: outcomeError } = await supabase
    .from("custom_bet_outcomes")
    .upsert(mapKeysToSnakeCase(outcomeRow), { onConflict: "id" });

  if (outcomeError && !isMissingRelationError(outcomeError)) {
    throw new Error(`Failed to persist custom bet outcome: ${outcomeError.message}`);
  }

  if (stakeLedgerRow) {
    const { error: stakeLedgerError } = await supabase
      .from("ledger_transactions")
      .upsert(mapKeysToSnakeCase(stakeLedgerRow), { onConflict: "id" });

    if (stakeLedgerError) {
      throw new Error(
        `Failed to upsert custom bet stake ledger: ${stakeLedgerError.message}`,
      );
    }
  }

  if (settlementLedgerRow) {
    const { error: ledgerError } = await supabase
      .from("ledger_transactions")
      .upsert(mapKeysToSnakeCase(settlementLedgerRow), { onConflict: "id" });

    if (ledgerError) {
      throw new Error(
        `Failed to upsert custom bet settlement ledger: ${ledgerError.message}`,
      );
    }
  }
}

function mapKeysToSnakeCase<TValue>(value: TValue): TValue {
  if (Array.isArray(value)) {
    return value.map((entry) => mapKeysToSnakeCase(entry)) as TValue;
  }

  if (!value || typeof value !== "object") {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, entryValue]) => [
      toSnakeCase(key),
      mapKeysToSnakeCase(entryValue),
    ]),
  ) as TValue;
}

function toSnakeCase(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .toLowerCase();
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
