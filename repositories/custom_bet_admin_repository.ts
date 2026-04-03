"use client";

import { supabase } from "../lib/supabase/client";
import type { CustomBetRecord } from "../types/custom_bet_type";

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
