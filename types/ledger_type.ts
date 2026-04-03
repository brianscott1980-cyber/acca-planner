export type LedgerTransactionKind = "deposit" | "stake" | "settlement";

export type LedgerTransactionRecord = {
  id: string;
  title: string;
  dateIso: string;
  amount: number;
  kind: LedgerTransactionKind;
  gameWeekId?: string;
  proposalId?: string;
};

export type LedgerActivity = {
  id: string;
  title: string;
  date: string;
  amount: number;
  tone: "positive" | "negative";
  kind: "deposit" | "stake" | "settlement";
};

export type PotTimelinePoint = {
  date: string;
  label: string;
  potValue: number;
  changeAmount: number;
  eventTitle: string | null;
  eventTransactionIds: string[];
};

export type LedgerRange = "1w" | "2w" | "1m" | "all";
