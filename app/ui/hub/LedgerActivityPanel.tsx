"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { trackEvent } from "../../../lib/analytics";
import { getRecentLedgerActivity } from "./ledgerService";
import { LedgerTable } from "./LedgerTable";

export function LedgerActivityPanel({
  highlightedTransactionIds = [],
  onHighlightTransactions,
}: {
  highlightedTransactionIds?: string[];
  onHighlightTransactions?: (transactionIds: string[]) => void;
}) {
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const allEntries = getRecentLedgerActivity();
  const latestEntries = getRecentLedgerActivity(3);

  return (
    <>
      <section className="hub-panel hub-activity-panel">
        <h2 className="hub-panel-title">Recent Activity</h2>

        <div className="hub-activity-list">
          <LedgerTable
            items={latestEntries}
            highlightedTransactionIds={highlightedTransactionIds}
            onHighlightTransactions={onHighlightTransactions}
          />
        </div>

        <button
          className="hub-link-button"
          type="button"
          onClick={() => {
            trackEvent("open_transactions_modal", {
              surface: "ledger_activity_panel",
            });
            setShowAllTransactions(true);
          }}
        >
          View All Transactions
        </button>
      </section>

      {showAllTransactions ? (
        <div
          className="hub-modal-backdrop"
          role="presentation"
          onClick={() => {
            trackEvent("close_transactions_modal", {
              method: "backdrop",
            });
            setShowAllTransactions(false);
          }}
        >
          <div
            className="hub-modal hub-transactions-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="all-transactions-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="hub-modal-header hub-transactions-modal-header">
              <div>
                <h2 id="all-transactions-title" className="hub-panel-title">
                  All Transactions
                </h2>
                <p className="hub-subtitle">
                  Full ledger history for all member deposits and settlements.
                </p>
              </div>

              <button
                className="hub-icon-button hub-transactions-modal-close"
                type="button"
                aria-label="Close transactions dialog"
                onClick={() => {
                  trackEvent("close_transactions_modal", {
                    method: "button",
                  });
                  setShowAllTransactions(false);
                }}
              >
                <X size={18} />
              </button>
            </div>

            <LedgerTable
              items={allEntries}
              highlightedTransactionIds={highlightedTransactionIds}
              onHighlightTransactions={onHighlightTransactions}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
