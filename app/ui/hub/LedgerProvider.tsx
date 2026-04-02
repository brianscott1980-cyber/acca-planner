"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { LedgerTransactionRecord } from "../../../data/ledger_data";
import { ledgerData } from "../../../data/ledger_data";
import { listLedgerTransactions, subscribeToLedgerTransactions } from "../../../repositories/ledgerRepository";
import { getCurrentLedgerTransactions, setCurrentLedgerTransactions } from "../../../repositories/ledgerStore";
import { useAuth } from "../auth/AuthProvider";

type LedgerContextValue = {
  transactions: LedgerTransactionRecord[];
  isLoading: boolean;
};

const LedgerContext = createContext<LedgerContextValue | null>(null);

export function LedgerProvider({ children }: { children: ReactNode }) {
  const { authUser, isConfigured } = useAuth();
  const [transactions, setTransactions] = useState<LedgerTransactionRecord[]>(
    getCurrentLedgerTransactions(),
  );
  const [isLoading, setIsLoading] = useState(Boolean(isConfigured));

  useEffect(() => {
    if (!isConfigured || !authUser) {
      setCurrentLedgerTransactions(ledgerData);
      setTransactions(ledgerData);
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

        const resolvedTransactions = nextTransactions.length > 0 ? nextTransactions : ledgerData;
        setCurrentLedgerTransactions(resolvedTransactions);
        setTransactions(resolvedTransactions);
      } catch (error) {
        console.error(error);
        if (!isActive) {
          return;
        }

        setCurrentLedgerTransactions(ledgerData);
        setTransactions(ledgerData);
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    void syncTransactions();
    const unsubscribe = subscribeToLedgerTransactions(syncTransactions);

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [authUser, isConfigured]);

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
