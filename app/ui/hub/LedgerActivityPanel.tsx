"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { getRecentLedgerActivity } from "./ledgerService";
import { LedgerTable } from "./LedgerTable";

export function LedgerActivityPanel() {
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const allEntries = getRecentLedgerActivity();
  const latestEntries = getRecentLedgerActivity(3);

  return (
    <>
      <section className="hub-panel hub-activity-panel">
        <h2 className="hub-panel-title">Recent Activity</h2>

        <div className="hub-activity-list">
          <LedgerTable items={latestEntries} />
        </div>

        <button
          className="hub-link-button"
          type="button"
          onClick={() => setShowAllTransactions(true)}
        >
          View All Transactions
        </button>
      </section>

      {showAllTransactions ? (
        <div
          className="hub-modal-backdrop"
          role="presentation"
          onClick={() => setShowAllTransactions(false)}
        >
          <div
            className="hub-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="all-transactions-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="hub-modal-header">
              <div>
                <h2 id="all-transactions-title" className="hub-panel-title">
                  All Transactions
                </h2>
                <p className="hub-subtitle">
                  Full ledger history for all member deposits and settlements.
                </p>
              </div>

              <button
                className="hub-icon-button"
                type="button"
                aria-label="Close transactions dialog"
                onClick={() => setShowAllTransactions(false)}
              >
                <X size={18} />
              </button>
            </div>

            <LedgerTable items={allEntries} />
          </div>
        </div>
      ) : null}
    </>
  );
}
