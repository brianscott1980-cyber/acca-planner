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
  },
  {
    "id": "stake-md-32",
    "title": "Matchday 32 Defensive Stake",
    "dateIso": "2026-04-09T17:30:00.000Z",
    "amount": -5,
    "kind": "stake",
    "gameWeekId": "md-32",
    "proposalId": "defensive"
  },
  {
    "id": "settlement-md-32",
    "title": "Matchday 32 Settled return",
    "dateIso": "2026-04-13T20:55:00.000Z",
    "amount": 10.38,
    "kind": "settlement",
    "gameWeekId": "md-32",
    "proposalId": "defensive"
  },
  {
    "id": "stake-md-33",
    "title": "Matchday 33 Aggressive Stake",
    "dateIso": "2026-04-17T00:30:00.000Z",
    "amount": -34,
    "kind": "stake",
    "gameWeekId": "md-33",
    "proposalId": "aggressive"
  },
  {
    "id": "stake-md-34",
    "title": "Matchday 34 Neutral Stake",
    "dateIso": "2026-04-24T00:30:00.000Z",
    "amount": -8,
    "kind": "stake",
    "gameWeekId": "md-34",
    "proposalId": "neutral"
  },
  {
    "id": "settlement-md-34",
    "title": "Matchday 34 Cashout return",
    "dateIso": "2026-04-27T10:00:00.000Z",
    "amount": 54.97,
    "kind": "settlement",
    "gameWeekId": "md-34",
    "proposalId": "neutral"
  },
  {
    "id": "stake-md-35",
    "title": "Matchday 35 Neutral Stake",
    "dateIso": "2026-05-01T00:30:00.000Z",
    "amount": -16,
    "kind": "stake",
    "gameWeekId": "md-35",
    "proposalId": "neutral"
  },
  {
    "id": "settlement-md-35",
    "title": "Matchday 35 Cashout return",
    "dateIso": "2026-05-04T15:00:00.000Z",
    "amount": 5.84,
    "kind": "settlement",
    "gameWeekId": "md-35",
    "proposalId": "neutral"
  }
];
