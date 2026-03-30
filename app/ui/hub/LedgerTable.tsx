import { ArrowDownLeft, ArrowUpRight, Target } from "lucide-react";
import { formatSignedCurrency, type LedgerActivity } from "./ledgerService";

type LedgerTableProps = {
  items: LedgerActivity[];
};

export function LedgerTable({ items }: LedgerTableProps) {
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
            <LedgerTableRow key={`${item.title}-${item.date}`} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LedgerTableRow({ item }: { item: LedgerActivity }) {
  const isPositive = item.tone === "positive";
  const Icon = isPositive
    ? item.kind === "settlement"
      ? ArrowUpRight
      : ArrowDownLeft
    : Target;

  return (
    <tr>
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
