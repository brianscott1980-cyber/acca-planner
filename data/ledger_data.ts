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

export const ledgerData: LedgerTransactionRecord[] = [
  {
    "id": "deposit-brian-scott",
    "title": "Brian Scott",
    "dateIso": "2026-03-23T09:00:00.000Z",
    "amount": 10,
    "kind": "deposit"
  },
  {
    "id": "deposit-tony-mclean",
    "title": "Tony McLean",
    "dateIso": "2026-03-23T09:00:00.000Z",
    "amount": 10,
    "kind": "deposit"
  },
  {
    "id": "deposit-john-colreavey",
    "title": "John Colreavey",
    "dateIso": "2026-03-23T09:00:00.000Z",
    "amount": 10,
    "kind": "deposit"
  },
  {
    "id": "deposit-paul-melville",
    "title": "Paul Melville",
    "dateIso": "2026-03-23T09:00:00.000Z",
    "amount": 10,
    "kind": "deposit"
  },
  {
    "id": "deposit-alasdair-head",
    "title": "Alasdair Head",
    "dateIso": "2026-03-23T09:00:00.000Z",
    "amount": 10,
    "kind": "deposit"
  },
  {
    "id": "deposit-paul-devine",
    "title": "Paul Devine",
    "dateIso": "2026-03-23T09:00:00.000Z",
    "amount": 10,
    "kind": "deposit"
  },
  {
    "id": "deposit-derek-mcmillan",
    "title": "Derek McMillan",
    "dateIso": "2026-03-23T09:00:00.000Z",
    "amount": 10,
    "kind": "deposit"
  }
];
