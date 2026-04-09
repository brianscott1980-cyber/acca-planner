import {
  persistCustomBetOutcomeRemote,
  persistCustomBetRemote,
  persistCustomBetStakeLedgerRemote,
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
  placedProposalRank,
  isFreeStake = false,
}: {
  customBetId: string;
  stakeAmount: number;
  placedDecimalOdds: number;
  placedAtIso: string;
  placedProposalRank: 1 | 2 | 3;
  isFreeStake?: boolean;
}) {
  const snapshot = getCurrentAppDataSnapshot();
  const currentCustomBet = getCustomBetById(customBetId);
  const existingStakeLedgerRow =
    snapshot.ledgerData.find(
      (entry) => entry.kind === "stake" && entry.customBetId === customBetId,
    ) ?? null;

  if (!currentCustomBet) {
    throw new Error(`Custom bet ${customBetId} was not found.`);
  }

  const placedProposal = currentCustomBet.proposedBets.find(
    (proposedBet) => proposedBet.rank === placedProposalRank,
  );

  if (!placedProposal) {
    throw new Error("Select a valid proposed bet option before marking placement.");
  }

  const nextCustomBet = {
    ...currentCustomBet,
    state: "staked" as const,
    isFreeStake: Boolean(isFreeStake || currentCustomBet.customBetType === "free_bet_offer"),
    placedProposalRank,
    placedMarket: placedProposal.market,
    placedSelection: placedProposal.selection,
    stakeAmount,
    placedDecimalOdds,
    placedAtIso,
  };
  const isFreeBetOffer = Boolean(nextCustomBet.isFreeStake);
  const stakeLedgerRow: LedgerTransactionRecord = {
    id: existingStakeLedgerRow?.id ?? `stake-custom-bet-${customBetId}`,
    title: isFreeBetOffer ? "Custom Bet Free Offer" : "Custom Bet Placed",
    dateIso: placedAtIso,
    amount: isFreeBetOffer ? 0 : -Math.abs(stakeAmount),
    kind: "stake",
    customBetId,
  };

  if (shouldUseRemoteAppData()) {
    await persistCustomBetRemote(nextCustomBet);

    await persistCustomBetStakeLedgerRemote(stakeLedgerRow);
  }

  const nextSnapshot = {
    ...snapshot,
    customBets: snapshot.customBets.map((customBet) =>
      customBet.id === customBetId ? nextCustomBet : customBet,
    ),
    ledgerData: upsertById(snapshot.ledgerData, stakeLedgerRow),
  };

  setCurrentAppDataSnapshot(nextSnapshot);
  setCurrentLedgerTransactions(nextSnapshot.ledgerData);

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
  const existingStakeLedgerRow =
    snapshot.ledgerData.find(
      (entry) => entry.kind === "stake" && entry.customBetId === customBetId,
    ) ?? null;

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
  const stakedAmount = Number(currentCustomBet.stakeAmount);

  if (!Number.isFinite(stakedAmount) || stakedAmount <= 0) {
    throw new Error("Custom bet stake amount is missing. Mark it as placed again first.");
  }

  const isFreeBetOffer = Boolean(
    currentCustomBet.isFreeStake || currentCustomBet.customBetType === "free_bet_offer",
  );
  const stakeLedgerRow: LedgerTransactionRecord = {
    id: existingStakeLedgerRow?.id ?? `stake-custom-bet-${customBetId}`,
    title: isFreeBetOffer ? "Custom Bet Free Offer" : "Custom Bet Placed",
    dateIso: currentCustomBet.placedAtIso ?? outcomeAtIso,
    amount: isFreeBetOffer ? 0 : -Math.abs(stakedAmount),
    kind: "stake",
    customBetId,
  };
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
      stakeLedgerRow,
      settlementLedgerRow,
    });
  }

  const ledgerWithStake = upsertById(snapshot.ledgerData, stakeLedgerRow);
  const ledgerWithoutExistingSettlement = ledgerWithStake.filter((entry) => {
    if (entry.kind === "settlement" && entry.customBetId === customBetId) {
      return false;
    }

    return true;
  });
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
