"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { listLedgerTransactions, subscribeToLedgerTransactions } from "../../../repositories/ledger_repository";
import {
  getCurrentLedgerTransactions,
  setCurrentLedgerTransactions,
} from "../../../services/ledger_service";
import { shouldUseRemoteAppData, getCurrentAppDataSnapshot } from "../../../services/app_data_service";
import type { LedgerTransactionRecord } from "../../../types/ledger_type";
import { useAuth } from "../auth/AuthProvider";

type LedgerContextValue = {
  transactions: LedgerTransactionRecord[];
  isLoading: boolean;
};

const LedgerContext = createContext<LedgerContextValue | null>(null);

export function LedgerProvider({ children }: { children: ReactNode }) {
  const { authUser, isConfigured } = useAuth();
  const isRemoteData = shouldUseRemoteAppData();
  const [transactions, setTransactions] = useState<LedgerTransactionRecord[]>(
    getCurrentLedgerTransactions(),
  );
  const [isLoading, setIsLoading] = useState(Boolean(isConfigured));

  useEffect(() => {
    const fallbackTransactions = getCurrentAppDataSnapshot().ledgerData;

    if (!isRemoteData || !isConfigured || !authUser) {
      setCurrentLedgerTransactions(fallbackTransactions);
      setTransactions(fallbackTransactions);
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const syncTransactions = async () => {
      try {
        const nextTransactions = await listLedgerTransactions();

        if (!isActive) {
          return;
        }

        const resolvedTransactions =
          nextTransactions.length > 0 ? nextTransactions : fallbackTransactions;
        setCurrentLedgerTransactions(resolvedTransactions);
        setTransactions(resolvedTransactions);
      } catch (error) {
        console.error(error);
        if (!isActive) {
          return;
        }

        setCurrentLedgerTransactions(fallbackTransactions);
        setTransactions(fallbackTransactions);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void syncTransactions();
    const unsubscribe = subscribeToLedgerTransactions(syncTransactions);
    const handleLocalLedgerUpdate = () => {
      setTransactions(getCurrentLedgerTransactions());
    };
    window.addEventListener("ledger-transactions-updated", handleLocalLedgerUpdate);

    return () => {
      isActive = false;
      unsubscribe();
      window.removeEventListener("ledger-transactions-updated", handleLocalLedgerUpdate);
    };
  }, [authUser, isConfigured, isRemoteData]);

  const value = useMemo(
    () => ({
      transactions,
      isLoading,
    }),
    [isLoading, transactions],
  );

  return <LedgerContext.Provider value={value}>{children}</LedgerContext.Provider>;
}

export function useLedger() {
  const context = useContext(LedgerContext);

  if (!context) {
    throw new Error("useLedger must be used within LedgerProvider");
  }

  return context;
}
