"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { loadRemoteAppDataSnapshot } from "../../../repositories/app_data_repository";
import {
  resetCurrentAppDataSnapshot,
  setCurrentAppDataSnapshot,
  shouldUseRemoteAppData,
} from "../../../services/app_data_service";
import { setCurrentLedgerTransactions } from "../../../services/ledger_service";
import { useAuth } from "../auth/AuthProvider";

type AppDataContextValue = {
  isRemoteData: boolean;
  isLoading: boolean;
};

const AppDataContext = createContext<AppDataContextValue | null>(null);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { authUser, isConfigured } = useAuth();
  const isRemoteData = shouldUseRemoteAppData();
  const [isLoading, setIsLoading] = useState(isRemoteData);

  useEffect(() => {
    if (!isRemoteData || !isConfigured || !authUser) {
      resetCurrentAppDataSnapshot();
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const loadSnapshot = async () => {
      try {
        const snapshot = await loadRemoteAppDataSnapshot();

        if (!isActive) {
          return;
        }

        setCurrentAppDataSnapshot(snapshot);
        setCurrentLedgerTransactions(snapshot.ledgerData);
      } catch (error) {
        console.error(error);
        if (!isActive) {
          return;
        }

        resetCurrentAppDataSnapshot();
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    setIsLoading(true);
    void loadSnapshot();

    return () => {
      isActive = false;
    };
  }, [authUser, isConfigured, isRemoteData]);

  const value = useMemo(
    () => ({
      isRemoteData,
      isLoading,
    }),
    [isLoading, isRemoteData],
  );

  if (isLoading) {
    return null;
  }

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error("useAppData must be used within AppDataProvider");
  }

  return context;
}
