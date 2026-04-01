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
    "title": "Matchday 32 Cashout return",
    "dateIso": "2026-04-11T15:45:00.000Z",
    "amount": 5.14,
    "kind": "settlement",
    "gameWeekId": "md-32",
    "proposalId": "defensive"
  },
  {
    "id": "stake-md-33",
    "title": "Matchday 33 Aggressive Stake",
    "dateIso": "2026-04-17T17:30:00.000Z",
    "amount": -31,
    "kind": "stake",
    "gameWeekId": "md-33",
    "proposalId": "aggressive"
  },
  {
    "id": "stake-md-34",
    "title": "Matchday 34 Neutral Stake",
    "dateIso": "2026-04-24T01:00:00.000Z",
    "amount": -10,
    "kind": "stake",
    "gameWeekId": "md-34",
    "proposalId": "neutral"
  },
  {
    "id": "settlement-md-34",
    "title": "Matchday 34 Cashout return",
    "dateIso": "2026-04-25T13:15:00.000Z",
    "amount": 11.18,
    "kind": "settlement",
    "gameWeekId": "md-34",
    "proposalId": "neutral"
  },
  {
    "id": "stake-md-35",
    "title": "Matchday 35 Neutral Stake",
    "dateIso": "2026-05-01T20:00:00.000Z",
    "amount": -9,
    "kind": "stake",
    "gameWeekId": "md-35",
    "proposalId": "neutral"
  },
  {
    "id": "stake-md-36",
    "title": "Matchday 36 Neutral Stake",
    "dateIso": "2026-05-08T20:00:00.000Z",
    "amount": -10,
    "kind": "stake",
    "gameWeekId": "md-36",
    "proposalId": "neutral"
  },
  {
    "id": "stake-md-37",
    "title": "Matchday 37 Defensive Stake",
    "dateIso": "2026-05-16T20:00:00.000Z",
    "amount": -2,
    "kind": "stake",
    "gameWeekId": "md-37",
    "proposalId": "defensive"
  },
  {
    "id": "settlement-md-37",
    "title": "Matchday 37 Cashout return",
    "dateIso": "2026-05-17T16:20:00.000Z",
    "amount": 2.04,
    "kind": "settlement",
    "gameWeekId": "md-37",
    "proposalId": "defensive"
  },
  {
    "id": "stake-md-38",
    "title": "Matchday 38 Defensive Stake",
    "dateIso": "2026-05-23T20:00:00.000Z",
    "amount": -1,
    "kind": "stake",
    "gameWeekId": "md-38",
    "proposalId": "defensive"
  },
  {
    "id": "settlement-md-38",
    "title": "Matchday 38 Cashout return",
    "dateIso": "2026-05-24T16:19:00.000Z",
    "amount": 1.25,
    "kind": "settlement",
    "gameWeekId": "md-38",
    "proposalId": "defensive"
  }
];
