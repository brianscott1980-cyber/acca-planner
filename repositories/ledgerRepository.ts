import type { RealtimeChannel } from "@supabase/supabase-js";
import type { LedgerTransactionRecord } from "../data/ledger_data";
import { supabase } from "../lib/supabase/client";

const LEDGER_TRANSACTIONS_TABLE = "ledger_transactions";

type LedgerTransactionRow = {
  id: string;
  title: string;
  date_iso: string;
  amount: number;
  kind: LedgerTransactionRecord["kind"];
  game_week_id: string | null;
  proposal_id: string | null;
};

export async function listLedgerTransactions() {
  if (!supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from(LEDGER_TRANSACTIONS_TABLE)
    .select("id, title, date_iso, amount, kind, game_week_id, proposal_id")
    .order("date_iso", { ascending: true });

  if (error) {
    throw new Error(`Failed to load ledger transactions: ${error.message}`);
  }

  return (data ?? []).map(mapLedgerTransactionRow);
}

export function subscribeToLedgerTransactions(
  onTransactionsChanged: () => void | Promise<void>,
) {
  if (!supabase) {
    return () => undefined;
  }

  const channel: RealtimeChannel = supabase
    .channel("ledger_transactions")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: LEDGER_TRANSACTIONS_TABLE,
      },
      () => {
        void onTransactionsChanged();
      },
    )
    .subscribe();

  return () => {
    void supabase.removeChannel(channel);
  };
}

function mapLedgerTransactionRow(row: LedgerTransactionRow): LedgerTransactionRecord {
  return {
    id: row.id,
    title: row.title,
    dateIso: row.date_iso,
    amount: Number(row.amount),
    kind: row.kind,
    gameWeekId: row.game_week_id ?? undefined,
    proposalId: row.proposal_id ?? undefined,
  };
}
