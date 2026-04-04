import {
  persistCustomBetOutcomeRemote,
  persistCustomBetRemote,
} from "../repositories/custom_bet_admin_repository";
import {
  getCurrentAppDataSnapshot,
  setCurrentAppDataSnapshot,
  shouldUseRemoteAppData,
} from "./app_data_service";
import { getCustomBetById } from "../repositories/custom_bet_repository";
import { setCurrentLedgerTransactions } from "./ledger_service";
import type { LedgerTransactionRecord } from "../types/ledger_type";
import type { CustomBetOutcomeRow } from "../types/league_simulation_type";

export async function markCustomBetAsStaked({
  customBetId,
  stakeAmount,
  placedDecimalOdds,
  placedAtIso,
}: {
  customBetId: string;
  stakeAmount: number;
  placedDecimalOdds: number;
  placedAtIso: string;
}) {
  const snapshot = getCurrentAppDataSnapshot();
  const currentCustomBet = getCustomBetById(customBetId);

  if (!currentCustomBet) {
    throw new Error(`Custom bet ${customBetId} was not found.`);
  }

  const nextCustomBet = {
    ...currentCustomBet,
    state: "staked" as const,
    stakeAmount,
    placedDecimalOdds,
    placedAtIso,
  };

  if (shouldUseRemoteAppData()) {
    await persistCustomBetRemote(nextCustomBet);
  }

  setCurrentAppDataSnapshot({
    ...snapshot,
    customBets: snapshot.customBets.map((customBet) =>
      customBet.id === customBetId ? nextCustomBet : customBet,
    ),
  });

  return nextCustomBet;
}

export async function setCustomBetOutcome({
  customBetId,
  outcomeStatus,
  outcomeValueAmount,
  outcomeAtIso,
  outcomeSummary,
  submittedByDisplayName,
}: {
  customBetId: string;
  outcomeStatus: "won" | "lost" | "cashed_out";
  outcomeValueAmount?: number;
  outcomeAtIso: string;
  outcomeSummary?: string;
  submittedByDisplayName?: string;
}) {
  const snapshot = getCurrentAppDataSnapshot();
  const currentCustomBet = getCustomBetById(customBetId);

  if (!currentCustomBet) {
    throw new Error(`Custom bet ${customBetId} was not found.`);
  }

  if (currentCustomBet.state !== "staked") {
    throw new Error("Custom bet must be staked before setting an outcome.");
  }

  const outcomeAtMs = new Date(outcomeAtIso).getTime();

  if (!Number.isFinite(outcomeAtMs)) {
    throw new Error("A valid outcome date/time is required.");
  }

  const requiresValue = outcomeStatus === "won" || outcomeStatus === "cashed_out";
  const normalizedOutcomeValue = requiresValue ? Number(outcomeValueAmount) : 0;

  if (requiresValue && (!Number.isFinite(normalizedOutcomeValue) || normalizedOutcomeValue < 0)) {
    throw new Error("Enter a valid return value for won or cashed out outcomes.");
  }

  const summary =
    outcomeSummary?.trim() ||
    (outcomeStatus === "won"
      ? "Custom bet won."
      : outcomeStatus === "cashed_out"
        ? "Custom bet cashed out."
        : "Custom bet lost.");
  const nextCustomBet = {
    ...currentCustomBet,
    outcomeStatus,
    outcomeValueAmount: normalizedOutcomeValue,
    outcomeAtIso,
    outcomeSummary: summary,
    outcomeSubmittedBy: submittedByDisplayName,
  };

  const outcomeRow: CustomBetOutcomeRow = {
    id: `custom-bet-outcome-${customBetId}`,
    customBetId,
    outcomeStatus,
    outcomeValueAmount: normalizedOutcomeValue,
    outcomeAtIso,
    summary,
    submittedBy: submittedByDisplayName,
  };

  const shouldCreateSettlementLedger =
    outcomeStatus === "won" || outcomeStatus === "cashed_out";
  const settlementLedgerRow: LedgerTransactionRecord | null = shouldCreateSettlementLedger
    ? {
        id: `settlement-custom-bet-${customBetId}`,
        title: submittedByDisplayName
          ? `${submittedByDisplayName} Custom Bet ${outcomeStatus === "cashed_out" ? "Cashed Out" : "Won"}`
          : `Custom Bet ${outcomeStatus === "cashed_out" ? "Cashed Out" : "Won"}`,
        dateIso: outcomeAtIso,
        amount: Math.abs(normalizedOutcomeValue),
        kind: "settlement",
        customBetId,
      }
    : null;

  if (shouldUseRemoteAppData()) {
    await persistCustomBetRemote(nextCustomBet);
    await persistCustomBetOutcomeRemote({
      outcomeRow,
      settlementLedgerRow,
    });
  }

  const ledgerWithoutExistingSettlement = snapshot.ledgerData.filter(
    (entry) => !(entry.kind === "settlement" && entry.customBetId === customBetId),
  );
  const nextSnapshot = {
    ...snapshot,
    customBets: snapshot.customBets.map((customBet) =>
      customBet.id === customBetId ? nextCustomBet : customBet,
    ),
    customBetOutcomes: upsertById(snapshot.customBetOutcomes, outcomeRow),
    ledgerData: settlementLedgerRow
      ? upsertById(ledgerWithoutExistingSettlement, settlementLedgerRow)
      : ledgerWithoutExistingSettlement,
  };

  setCurrentAppDataSnapshot(nextSnapshot);
  setCurrentLedgerTransactions(nextSnapshot.ledgerData);

  return nextCustomBet;
}

function upsertById<TRecord extends { id: string }>(rows: TRecord[], row: TRecord) {
  const withoutExistingRow = rows.filter((existingRow) => existingRow.id !== row.id);
  return [...withoutExistingRow, row];
}
