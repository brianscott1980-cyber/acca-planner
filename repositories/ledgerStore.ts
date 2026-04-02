import {
  ledgerData,
  type LedgerTransactionRecord,
} from "../data/ledger_data";

let currentLedgerTransactions: LedgerTransactionRecord[] = ledgerData;

export function getCurrentLedgerTransactions() {
  return currentLedgerTransactions;
}

export function setCurrentLedgerTransactions(
  transactions: LedgerTransactionRecord[],
) {
  currentLedgerTransactions = transactions;
}
