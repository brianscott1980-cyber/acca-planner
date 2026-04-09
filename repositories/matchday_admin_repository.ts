"use client";

import { supabase } from "../lib/supabase/client";
import type {
  LeagueDataMetaRecord,
  LeagueMatchdaySimulationRow,
  LeagueMatchdayVoteRow,
  LeagueSimulationSlipRow,
  MatchdayOutcomeRow,
  LeagueSimulationLegResultRow,
} from "../types/league_simulation_type";
import type { LedgerTransactionRecord } from "../types/ledger_type";

export async function persistEndedMatchdayVotingRemote({
  gameWeekId,
  votesByUserId,
  metaRow,
  simulationRow,
  slipRow,
  voteRows,
}: {
  gameWeekId: string;
  votesByUserId: Record<string, string>;
  metaRow: LeagueDataMetaRecord;
  simulationRow: LeagueMatchdaySimulationRow;
  slipRow: LeagueSimulationSlipRow;
  voteRows: LeagueMatchdayVoteRow[];
}) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const remoteVotesByUserId = mapKeysToSnakeCase(votesByUserId);
  const { error: gameWeekError } = await supabase
    .from("matchday_game_weeks")
    .update({ votes_by_user_id: remoteVotesByUserId })
    .eq("id", gameWeekId);

  if (gameWeekError) {
    throw new Error(`Failed to update ${gameWeekId} votes: ${gameWeekError.message}`);
  }

  const { error: metaError } = await supabase
    .from("league_data_meta")
    .upsert(mapKeysToSnakeCase(metaRow), { onConflict: "id" });

  if (metaError) {
    throw new Error(`Failed to update league data meta: ${metaError.message}`);
  }

  const { error: simulationError } = await supabase
    .from("league_data_matchday_simulations")
    .upsert(mapKeysToSnakeCase(simulationRow), { onConflict: "id" });

  if (simulationError) {
    throw new Error(
      `Failed to upsert matchday simulation for ${gameWeekId}: ${simulationError.message}`,
    );
  }

  const { error: slipError } = await supabase
    .from("league_data_slips")
    .upsert(mapKeysToSnakeCase(slipRow), { onConflict: "id" });

  if (slipError) {
    throw new Error(`Failed to upsert matchday slip for ${gameWeekId}: ${slipError.message}`);
  }

  if (voteRows.length === 0) {
    return;
  }

  const { error: voteError } = await supabase
    .from("league_data_votes")
    .upsert(voteRows.map((voteRow) => mapKeysToSnakeCase(voteRow)), { onConflict: "id" });

  if (voteError) {
    throw new Error(`Failed to upsert matchday votes for ${gameWeekId}: ${voteError.message}`);
  }
}

export async function persistMatchdayOutcomeRemote({
  metaRow,
  slipRow,
  legResultRows,
  outcomeRow,
  stakeLedgerRow,
  settlementLedgerRow,
}: {
  metaRow: LeagueDataMetaRecord;
  slipRow: LeagueSimulationSlipRow;
  legResultRows: LeagueSimulationLegResultRow[];
  outcomeRow: MatchdayOutcomeRow;
  stakeLedgerRow: LedgerTransactionRecord | null;
  settlementLedgerRow: LedgerTransactionRecord | null;
}) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { error: metaError } = await supabase
    .from("league_data_meta")
    .upsert(mapKeysToSnakeCase(metaRow), { onConflict: "id" });

  if (metaError) {
    throw new Error(`Failed to update league data meta: ${metaError.message}`);
  }

  const { error: slipError } = await supabase
    .from("league_data_slips")
    .upsert(mapKeysToSnakeCase(slipRow), { onConflict: "id" });

  if (slipError) {
    throw new Error(
      `Failed to update matchday slip for ${slipRow.gameWeekId}: ${slipError.message}`,
    );
  }

  if (legResultRows.length > 0) {
    const { error: legError } = await supabase
      .from("league_data_leg_results")
      .upsert(legResultRows.map((row) => mapKeysToSnakeCase(row)), { onConflict: "id" });

    if (legError) {
      throw new Error(
        `Failed to update leg results for ${slipRow.gameWeekId}: ${legError.message}`,
      );
    }
  }

  const { error: outcomeError } = await supabase
    .from("matchday_outcomes")
    .upsert(mapKeysToSnakeCase(outcomeRow), { onConflict: "id" });

  if (outcomeError && !isMissingRelationError(outcomeError)) {
    throw new Error(
      `Failed to persist matchday outcome for ${slipRow.gameWeekId}: ${outcomeError.message}`,
    );
  }

  if (stakeLedgerRow) {
    const { error: stakeLedgerError } = await supabase
      .from("ledger_transactions")
      .upsert(mapKeysToSnakeCase(stakeLedgerRow), { onConflict: "id" });

    if (stakeLedgerError) {
      throw new Error(
        `Failed to upsert stake ledger for ${slipRow.gameWeekId}: ${stakeLedgerError.message}`,
      );
    }
  }

  if (settlementLedgerRow) {
    const { error: ledgerError } = await supabase
      .from("ledger_transactions")
      .upsert(mapKeysToSnakeCase(settlementLedgerRow), { onConflict: "id" });

    if (ledgerError) {
      throw new Error(
        `Failed to upsert settlement ledger for ${slipRow.gameWeekId}: ${ledgerError.message}`,
      );
    }
  }
}

export async function persistPlacedMatchdayBetRemote({
  metaRow,
  simulationRow,
  slipRow,
  ledgerTransactionRow,
}: {
  metaRow: LeagueDataMetaRecord;
  simulationRow: LeagueMatchdaySimulationRow;
  slipRow: LeagueSimulationSlipRow;
  ledgerTransactionRow: LedgerTransactionRecord | null;
}) {
  if (!supabase) {
    throw new Error("Supabase is not configured.");
  }

  const { error: metaError } = await supabase
    .from("league_data_meta")
    .upsert(mapKeysToSnakeCase(metaRow), { onConflict: "id" });

  if (metaError) {
    throw new Error(`Failed to update league data meta: ${metaError.message}`);
  }

  const { error: simulationError } = await supabase
    .from("league_data_matchday_simulations")
    .upsert(mapKeysToSnakeCase(simulationRow), { onConflict: "id" });

  if (simulationError) {
    throw new Error(
      `Failed to update matchday simulation for ${simulationRow.gameWeekId}: ${simulationError.message}`,
    );
  }

  const { error: slipError } = await supabase
    .from("league_data_slips")
    .upsert(mapKeysToSnakeCase(slipRow), { onConflict: "id" });

  if (slipError) {
    throw new Error(
      `Failed to update matchday slip for ${simulationRow.gameWeekId}: ${slipError.message}`,
    );
  }

  if (ledgerTransactionRow) {
    const { error: ledgerError } = await supabase
      .from("ledger_transactions")
      .upsert(mapKeysToSnakeCase(ledgerTransactionRow), { onConflict: "id" });

    if (ledgerError) {
      throw new Error(
        `Failed to upsert ledger transaction for ${simulationRow.gameWeekId}: ${ledgerError.message}`,
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
