"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import Image from "next/image";
import { loadRemoteAppDataSnapshot } from "../../../repositories/app_data_repository";
import { withBasePath } from "../../../lib/site";
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
  const [remoteLoadError, setRemoteLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isRemoteData || !isConfigured || !authUser) {
      resetCurrentAppDataSnapshot();
      setRemoteLoadError(null);
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
        setRemoteLoadError(null);
      } catch (error) {
        console.error(error);
        if (!isActive) {
          return;
        }

        setRemoteLoadError(
          error instanceof Error
            ? error.message
            : "Failed to load remote app data from Supabase.",
        );
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
    return (
      <section className="auth-shell">
        <div className="auth-card hub-panel">
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.25rem" }}>
            <Image
              src={withBasePath("/assets/app_logos/logo_512px.png")}
              alt="Caddyshack logo"
              width={300}
              height={300}
              priority
            />
          </div>
          <h1 className="hub-title">Loading syndicate data</h1>
          <p className="hub-subtitle">Loading the latest syndicate data.</p>
        </div>
      </section>
    );
  }

  if (isRemoteData && remoteLoadError) {
    return (
      <section className="auth-shell">
        <div className="auth-card hub-panel">
          <h1 className="hub-title">Remote Data Unavailable</h1>
          <p className="hub-subtitle">
            The app is set to use Supabase data, but the mirrored tables could not be
            read. Check your table permissions and read policies, then try again.
          </p>
          <p className="hub-subtitle">{remoteLoadError}</p>
        </div>
      </section>
    );
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
