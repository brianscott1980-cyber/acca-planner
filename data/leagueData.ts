export type LeagueSimulationSlipRecord = {
  proposalId: string;
  timelineLabel: string;
  stake: number;
  stakePlacedAt: string;
  settledAt: string;
  settlementKind: "settled" | "cashout";
  returnAmount: number;
  status: "win" | "loss";
};

export type LeagueMatchdaySimulationRecord = {
  gameWeekId: string;
  voteResolvedAtIso: string;
  betPlacedAtIso: string;
  selectedProposalId: string;
  votesByUserId: Record<string, string>;
  betLineOddsByLabel: Record<string, string>;
  simulatedSlip: LeagueSimulationSlipRecord;
};

export type LeagueDataRecord = {
  simulatedAtIso: string;
  updatedAtIso: string;
  matchdaySimulations: LeagueMatchdaySimulationRecord[];
};

export const leagueData: LeagueDataRecord = {
  "simulatedAtIso": "2026-05-07T11:00:00.000Z",
  "updatedAtIso": "2026-03-31T22:37:58.389Z",
  "matchdaySimulations": [
    {
      "gameWeekId": "md-32",
      "voteResolvedAtIso": "2026-04-07T11:30:00.000Z",
      "betPlacedAtIso": "2026-04-09T17:30:00.000Z",
      "selectedProposalId": "defensive",
      "votesByUserId": {
        "brian-scott": "defensive",
        "tony-mclean": "aggressive",
        "john-colreavey": "defensive",
        "paul-melville": "defensive",
        "alasdair-head": "defensive",
        "paul-devine": "defensive",
        "derek-mcmillan": "neutral"
      },
      "betLineOddsByLabel": {
        "Arsenal v Bournemouth: Arsenal Draw No Bet": "1.28",
        "Liverpool v Fulham: Over 1.5 Goals": "1.22",
        "Chelsea v Man City: Over 1.5 Goals": "1.33",
        "Arsenal v Bournemouth: Arsenal to Win": "1.50",
        "Liverpool v Fulham: Liverpool to Win": "1.42",
        "Chelsea v Man City: Both Teams To Score": "1.57",
        "Man Utd v Leeds United: Over 2.5 Goals": "1.72",
        "Arsenal v Bournemouth: Arsenal -1 Handicap": "1.95",
        "Liverpool v Fulham: Liverpool to Win & Over 2.5 Goals": "1.83",
        "Chelsea v Man City: Both Teams To Score & Over 2.5 Goals": "1.91",
        "Man Utd v Leeds United: Man Utd to Win & Over 2.5 Goals": "1.89"
      },
      "simulatedSlip": {
        "proposalId": "defensive",
        "timelineLabel": "Defensive Strategy",
        "stake": 5,
        "stakePlacedAt": "2026-04-09T17:30:00.000Z",
        "settledAt": "2026-04-13T20:55:00.000Z",
        "settlementKind": "settled",
        "returnAmount": 10.38,
        "status": "win"
      }
    },
    {
      "gameWeekId": "md-33",
      "voteResolvedAtIso": "2026-04-14T18:30:00.000Z",
      "betPlacedAtIso": "2026-04-17T00:30:00.000Z",
      "selectedProposalId": "aggressive",
      "votesByUserId": {
        "brian-scott": "aggressive",
        "tony-mclean": "aggressive",
        "john-colreavey": "aggressive",
        "paul-melville": "neutral",
        "alasdair-head": "neutral",
        "paul-devine": "aggressive",
        "derek-mcmillan": "defensive"
      },
      "betLineOddsByLabel": {
        "Tottenham v Crystal Palace: Tottenham Draw No Bet": "1.50",
        "Newcastle Utd v Burnley: Newcastle to Win": "1.77",
        "Aston Villa v Everton: Over 1.5 Goals": "1.55",
        "Tottenham v Crystal Palace: Tottenham to Win": "1.93",
        "Newcastle Utd v Burnley: Over 2.5 Goals": "2.26",
        "Aston Villa v Everton: Both Teams To Score": "1.51",
        "Chelsea v Brighton: Over 2.5 Goals": "2.13",
        "Tottenham v Crystal Palace: Tottenham to Win & Over 2.5 Goals": "2.20",
        "Newcastle Utd v Burnley: Newcastle -1 Handicap": "2.15",
        "Aston Villa v Everton: Aston Villa to Win & Both Teams To Score": "1.51",
        "Chelsea v Brighton: Both Teams To Score & Over 2.5 Goals": "2.17"
      },
      "simulatedSlip": {
        "proposalId": "aggressive",
        "timelineLabel": "Aggressive Strategy",
        "stake": 34,
        "stakePlacedAt": "2026-04-17T00:30:00.000Z",
        "settledAt": "2026-04-20T20:55:00.000Z",
        "settlementKind": "settled",
        "returnAmount": 0,
        "status": "loss"
      }
    },
    {
      "gameWeekId": "md-34",
      "voteResolvedAtIso": "2026-04-21T18:30:00.000Z",
      "betPlacedAtIso": "2026-04-24T00:30:00.000Z",
      "selectedProposalId": "neutral",
      "votesByUserId": {
        "brian-scott": "neutral",
        "tony-mclean": "aggressive",
        "john-colreavey": "neutral",
        "paul-melville": "neutral",
        "alasdair-head": "neutral",
        "paul-devine": "neutral",
        "derek-mcmillan": "defensive"
      },
      "betLineOddsByLabel": {
        "Liverpool v Brentford: Liverpool Draw No Bet": "1.39",
        "West Ham v Fulham: Over 1.5 Goals": "1.59",
        "Arsenal v Wolves: Arsenal to Win": "1.68",
        "Liverpool v Brentford: Liverpool to Win": "1.74",
        "West Ham v Fulham: Both Teams To Score": "1.50",
        "Arsenal v Wolves: Arsenal -1 Handicap": "2.00",
        "Man City v Leeds United: Over 2.5 Goals": "2.07",
        "Liverpool v Brentford: Liverpool to Win & Over 2.5 Goals": "2.09",
        "West Ham v Fulham: Both Teams To Score & Over 2.5 Goals": "2.33",
        "Arsenal v Wolves: Arsenal Win to Nil": "2.62",
        "Man City v Leeds United: Man City -1 Handicap": "1.86"
      },
      "simulatedSlip": {
        "proposalId": "neutral",
        "timelineLabel": "Neutral Strategy",
        "stake": 8,
        "stakePlacedAt": "2026-04-24T00:30:00.000Z",
        "settledAt": "2026-04-27T10:00:00.000Z",
        "settlementKind": "cashout",
        "returnAmount": 54.97,
        "status": "win"
      }
    },
    {
      "gameWeekId": "md-35",
      "voteResolvedAtIso": "2026-04-28T18:30:00.000Z",
      "betPlacedAtIso": "2026-05-01T00:30:00.000Z",
      "selectedProposalId": "neutral",
      "votesByUserId": {
        "brian-scott": "neutral",
        "tony-mclean": "neutral",
        "john-colreavey": "neutral",
        "paul-melville": "defensive",
        "alasdair-head": "neutral",
        "paul-devine": "neutral",
        "derek-mcmillan": "aggressive"
      },
      "betLineOddsByLabel": {
        "Chelsea v Wolves: Chelsea Draw No Bet": "1.46",
        "Tottenham v West Ham: Over 1.5 Goals": "1.55",
        "Newcastle Utd v Fulham: Newcastle to Win": "1.96",
        "Chelsea v Wolves: Chelsea to Win": "1.86",
        "Tottenham v West Ham: Both Teams To Score": "1.48",
        "Newcastle Utd v Fulham: Newcastle -1 Handicap": "2.73",
        "Brighton v Brentford: Over 2.5 Goals": "2.24",
        "Chelsea v Wolves: Chelsea to Win & Over 2.5 Goals": "2.19",
        "Tottenham v West Ham: Both Teams To Score & Over 2.5 Goals": "2.21",
        "Newcastle Utd v Fulham: Newcastle Win to Nil": "3.95",
        "Brighton v Brentford: Brighton to Win & Over 2.5 Goals": "2.24"
      },
      "simulatedSlip": {
        "proposalId": "neutral",
        "timelineLabel": "Neutral Strategy",
        "stake": 16,
        "stakePlacedAt": "2026-05-01T00:30:00.000Z",
        "settledAt": "2026-05-04T15:00:00.000Z",
        "settlementKind": "cashout",
        "returnAmount": 5.84,
        "status": "loss"
      }
    }
  ]
};
