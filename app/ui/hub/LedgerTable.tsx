import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { formatSignedCurrency } from "../../../services/ledger_service";
import type { LedgerActivity } from "../../../types/ledger_type";

type LedgerTableProps = {
  items: LedgerActivity[];
  highlightedTransactionIds?: string[];
  onHighlightTransactions?: (transactionIds: string[]) => void;
};

export function LedgerTable({
  items,
  highlightedTransactionIds = [],
  onHighlightTransactions,
}: LedgerTableProps) {
  return (
    <div className="hub-ledger-table-wrap">
      <table className="hub-ledger-table">
        <thead>
          <tr>
            <th>Transaction</th>
            <th>Date</th>
            <th>Type</th>
            <th className="hub-ledger-table-amount">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <LedgerTableRow
              key={item.id}
              item={item}
              isHighlighted={highlightedTransactionIds.includes(item.id)}
              onHighlightTransactions={onHighlightTransactions}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LedgerTableRow({
  item,
  isHighlighted,
  onHighlightTransactions,
}: {
  item: LedgerActivity;
  isHighlighted: boolean;
  onHighlightTransactions?: (transactionIds: string[]) => void;
}) {
  const isPositive = item.amount >= 0;
  const Icon = isPositive ? ArrowUpRight : ArrowDownRight;

  return (
    <tr
      className={isHighlighted ? "is-highlighted" : undefined}
      onMouseEnter={() => onHighlightTransactions?.([item.id])}
      onMouseLeave={() => onHighlightTransactions?.([])}
    >
      <td>
        <div className="hub-ledger-table-main">
          <div
            className={`hub-activity-icon${isPositive ? " is-positive" : " is-negative"}`}
          >
            <Icon size={18} />
          </div>
          <div>
            <p>{item.title}</p>
          </div>
        </div>
      </td>
      <td className="hub-ledger-table-muted">{item.date}</td>
      <td className="hub-ledger-table-muted hub-ledger-table-type">
        {formatKind(item.kind)}
      </td>
      <td
        className={`hub-ledger-table-amount ${
          isPositive ? "hub-success-text" : "hub-danger-text"
        }`}
      >
        {formatSignedCurrency(item.amount)}
      </td>
    </tr>
  );
}

function formatKind(kind: LedgerActivity["kind"]) {
  if (kind === "deposit") {
    return "Deposit";
  }

  if (kind === "settlement") {
    return "Settlement";
  }

  return "Stake";
}
