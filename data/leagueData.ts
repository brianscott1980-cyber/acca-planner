export type LeagueSimulationLegStatus = "won" | "lost" | "cashed_out";

export type LeagueSimulationLegRecord = {
  betLineLabel: string;
  kickoffAt: string;
  settledAt: string;
  finalScore: string;
  status: LeagueSimulationLegStatus;
  actualStatus: "won" | "lost";
};

export type LeagueSimulationSlipRecord = {
  proposalId: string;
  timelineLabel: string;
  stake: number;
  stakePlacedAt: string;
  settledAt: string;
  settlementKind: "settled" | "cashout";
  returnAmount: number;
  status: "win" | "loss";
  legResults: LeagueSimulationLegRecord[];
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
  "simulatedAtIso": "2026-06-01T15:00:00.000Z",
  "updatedAtIso": "2026-04-01T22:12:02.187Z",
  "matchdaySimulations": [
    {
      "gameWeekId": "md-32",
      "voteResolvedAtIso": "2026-04-08T23:00:00.000Z",
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
        "settledAt": "2026-04-11T15:45:00.000Z",
        "settlementKind": "cashout",
        "returnAmount": 5.14,
        "status": "win",
        "legResults": [
          {
            "betLineLabel": "Arsenal v Bournemouth: Arsenal Draw No Bet",
            "kickoffAt": "2026-04-11T11:30:00.000Z",
            "settledAt": "2026-04-11T13:30:00.000Z",
            "finalScore": "Arsenal 4-0 Bournemouth",
            "status": "won",
            "actualStatus": "won"
          },
          {
            "betLineLabel": "Liverpool v Fulham: Over 1.5 Goals",
            "kickoffAt": "2026-04-11T16:30:00.000Z",
            "settledAt": "2026-04-11T18:21:00.000Z",
            "finalScore": "Liverpool 1-0 Fulham",
            "status": "cashed_out",
            "actualStatus": "lost"
          },
          {
            "betLineLabel": "Chelsea v Man City: Over 1.5 Goals",
            "kickoffAt": "2026-04-12T15:30:00.000Z",
            "settledAt": "2026-04-12T17:18:00.000Z",
            "finalScore": "Chelsea 2-0 Man City",
            "status": "cashed_out",
            "actualStatus": "won"
          }
        ]
      }
    },
    {
      "gameWeekId": "md-33",
      "voteResolvedAtIso": "2026-04-16T23:00:00.000Z",
      "betPlacedAtIso": "2026-04-17T17:30:00.000Z",
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
        "Brentford v Fulham: Over 1.5 Goals": "1.61",
        "Aston Villa v Sunderland: Aston Villa Draw No Bet": "1.38",
        "Crystal Palace v West Ham United: Over 1.5 Goals": "1.59",
        "Newcastle United v Bournemouth: Newcastle United to Win": "1.96",
        "Chelsea v Man Utd: Both Teams To Score": "1.47",
        "Everton v Liverpool: Over 2.5 Goals": "2.08",
        "Man City v Arsenal: Both Teams To Score": "1.47",
        "Newcastle United v Bournemouth: Newcastle United to Win & Over 2.5 Goals": "2.19",
        "Chelsea v Man Utd: Both Teams To Score & Over 2.5 Goals": "2.16",
        "Everton v Liverpool: Both Teams To Score & Over 2.5 Goals": "2.19",
        "Man City v Arsenal: Both Teams To Score & Over 2.5 Goals": "2.00"
      },
      "simulatedSlip": {
        "proposalId": "aggressive",
        "timelineLabel": "Aggressive Strategy",
        "stake": 31,
        "stakePlacedAt": "2026-04-17T17:30:00.000Z",
        "settledAt": "2026-04-18T16:03:00.000Z",
        "settlementKind": "settled",
        "returnAmount": 0,
        "status": "loss",
        "legResults": [
          {
            "betLineLabel": "Newcastle United v Bournemouth: Newcastle United to Win & Over 2.5 Goals",
            "kickoffAt": "2026-04-18T14:00:00.000Z",
            "settledAt": "2026-04-18T16:03:00.000Z",
            "finalScore": "Newcastle United 2-0 Bournemouth",
            "status": "lost",
            "actualStatus": "lost"
          },
          {
            "betLineLabel": "Chelsea v Man Utd: Both Teams To Score & Over 2.5 Goals",
            "kickoffAt": "2026-04-18T19:00:00.000Z",
            "settledAt": "2026-04-18T21:04:00.000Z",
            "finalScore": "Chelsea 1-0 Man Utd",
            "status": "lost",
            "actualStatus": "lost"
          },
          {
            "betLineLabel": "Everton v Liverpool: Both Teams To Score & Over 2.5 Goals",
            "kickoffAt": "2026-04-19T13:00:00.000Z",
            "settledAt": "2026-04-19T14:52:00.000Z",
            "finalScore": "Everton 3-0 Liverpool",
            "status": "lost",
            "actualStatus": "lost"
          },
          {
            "betLineLabel": "Man City v Arsenal: Both Teams To Score & Over 2.5 Goals",
            "kickoffAt": "2026-04-19T15:30:00.000Z",
            "settledAt": "2026-04-19T17:32:00.000Z",
            "finalScore": "Man City 0-2 Arsenal",
            "status": "lost",
            "actualStatus": "lost"
          }
        ]
      }
    },
    {
      "gameWeekId": "md-34",
      "voteResolvedAtIso": "2026-04-22T23:00:00.000Z",
      "betPlacedAtIso": "2026-04-24T01:00:00.000Z",
      "selectedProposalId": "neutral",
      "votesByUserId": {
        "brian-scott": "neutral",
        "tony-mclean": "aggressive",
        "john-colreavey": "neutral",
        "paul-melville": "defensive",
        "alasdair-head": "neutral",
        "paul-devine": "neutral",
        "derek-mcmillan": "defensive"
      },
      "betLineOddsByLabel": {
        "Fulham v Aston Villa: Over 1.5 Goals": "1.55",
        "Arsenal v Newcastle United: Arsenal Draw No Bet": "1.50",
        "Brighton v Chelsea: Over 1.5 Goals": "1.53",
        "Sunderland v Nottingham Forest: Over 1.5 Goals": "1.63",
        "Liverpool v Crystal Palace: Liverpool to Win": "1.74",
        "Arsenal v Newcastle United: Arsenal to Win": "1.93",
        "Man Utd v Brentford: Over 2.5 Goals": "2.20",
        "Liverpool v Crystal Palace: Liverpool to Win & Over 2.5 Goals": "2.09",
        "Arsenal v Newcastle United: Both Teams To Score & Over 2.5 Goals": "2.07",
        "Brighton v Chelsea: Both Teams To Score & Over 2.5 Goals": "2.17",
        "Man Utd v Brentford: Man Utd to Win & Over 2.5 Goals": "2.20"
      },
      "simulatedSlip": {
        "proposalId": "neutral",
        "timelineLabel": "Neutral Strategy",
        "stake": 10,
        "stakePlacedAt": "2026-04-24T01:00:00.000Z",
        "settledAt": "2026-04-25T13:15:00.000Z",
        "settlementKind": "cashout",
        "returnAmount": 11.18,
        "status": "win",
        "legResults": [
          {
            "betLineLabel": "Sunderland v Nottingham Forest: Over 1.5 Goals",
            "kickoffAt": "2026-04-24T19:00:00.000Z",
            "settledAt": "2026-04-24T20:51:00.000Z",
            "finalScore": "Sunderland 1-1 Nottingham Forest",
            "status": "won",
            "actualStatus": "won"
          },
          {
            "betLineLabel": "Liverpool v Crystal Palace: Liverpool to Win",
            "kickoffAt": "2026-04-25T14:00:00.000Z",
            "settledAt": "2026-04-25T15:52:00.000Z",
            "finalScore": "Liverpool 1-1 Crystal Palace",
            "status": "cashed_out",
            "actualStatus": "lost"
          },
          {
            "betLineLabel": "Arsenal v Newcastle United: Arsenal to Win",
            "kickoffAt": "2026-04-25T16:30:00.000Z",
            "settledAt": "2026-04-25T18:24:00.000Z",
            "finalScore": "Arsenal 2-0 Newcastle United",
            "status": "cashed_out",
            "actualStatus": "won"
          },
          {
            "betLineLabel": "Man Utd v Brentford: Over 2.5 Goals",
            "kickoffAt": "2026-04-27T19:00:00.000Z",
            "settledAt": "2026-04-27T21:03:00.000Z",
            "finalScore": "Man Utd 3-0 Brentford",
            "status": "cashed_out",
            "actualStatus": "won"
          }
        ]
      }
    },
    {
      "gameWeekId": "md-35",
      "voteResolvedAtIso": "2026-04-30T23:00:00.000Z",
      "betPlacedAtIso": "2026-05-01T20:00:00.000Z",
      "selectedProposalId": "neutral",
      "votesByUserId": {
        "brian-scott": "neutral",
        "tony-mclean": "neutral",
        "john-colreavey": "neutral",
        "paul-melville": "defensive",
        "alasdair-head": "defensive",
        "paul-devine": "neutral",
        "derek-mcmillan": "aggressive"
      },
      "betLineOddsByLabel": {
        "Aston Villa v Tottenham Hotspur: Over 1.5 Goals": "1.53",
        "Arsenal v Fulham: Arsenal Draw No Bet": "1.39",
        "Everton v Man City: Over 1.5 Goals": "1.48",
        "Leeds United v Burnley: Over 2.5 Goals": "2.46",
        "Arsenal v Fulham: Arsenal to Win": "1.74",
        "Chelsea v Nottingham Forest: Chelsea to Win": "1.96",
        "Everton v Man City: Both Teams To Score": "1.51",
        "Leeds United v Burnley: Both Teams To Score & Over 2.5 Goals": "2.59",
        "Aston Villa v Tottenham Hotspur: Both Teams To Score & Over 2.5 Goals": "2.17",
        "Arsenal v Fulham: Arsenal to Win & Over 2.5 Goals": "2.06",
        "Everton v Man City: Both Teams To Score & Over 2.5 Goals": "2.15"
      },
      "simulatedSlip": {
        "proposalId": "neutral",
        "timelineLabel": "Neutral Strategy",
        "stake": 9,
        "stakePlacedAt": "2026-05-01T20:00:00.000Z",
        "settledAt": "2026-05-02T15:51:00.000Z",
        "settlementKind": "settled",
        "returnAmount": 0,
        "status": "loss",
        "legResults": [
          {
            "betLineLabel": "Leeds United v Burnley: Over 2.5 Goals",
            "kickoffAt": "2026-05-02T14:00:00.000Z",
            "settledAt": "2026-05-02T15:50:00.000Z",
            "finalScore": "Leeds United 1-2 Burnley",
            "status": "won",
            "actualStatus": "won"
          },
          {
            "betLineLabel": "Arsenal v Fulham: Arsenal to Win",
            "kickoffAt": "2026-05-02T14:00:00.000Z",
            "settledAt": "2026-05-02T15:51:00.000Z",
            "finalScore": "Arsenal 0-2 Fulham",
            "status": "lost",
            "actualStatus": "lost"
          },
          {
            "betLineLabel": "Chelsea v Nottingham Forest: Chelsea to Win",
            "kickoffAt": "2026-05-02T14:00:00.000Z",
            "settledAt": "2026-05-02T15:49:00.000Z",
            "finalScore": "Chelsea 4-0 Nottingham Forest",
            "status": "won",
            "actualStatus": "won"
          },
          {
            "betLineLabel": "Everton v Man City: Both Teams To Score",
            "kickoffAt": "2026-05-02T14:00:00.000Z",
            "settledAt": "2026-05-02T15:57:00.000Z",
            "finalScore": "Everton 1-2 Man City",
            "status": "won",
            "actualStatus": "won"
          }
        ]
      }
    },
    {
      "gameWeekId": "md-36",
      "voteResolvedAtIso": "2026-05-07T23:00:00.000Z",
      "betPlacedAtIso": "2026-05-08T20:00:00.000Z",
      "selectedProposalId": "neutral",
      "votesByUserId": {
        "brian-scott": "defensive",
        "tony-mclean": "aggressive",
        "john-colreavey": "neutral",
        "paul-melville": "neutral",
        "alasdair-head": "defensive",
        "paul-devine": "neutral",
        "derek-mcmillan": "neutral"
      },
      "betLineOddsByLabel": {
        "Liverpool v Chelsea: Over 1.5 Goals": "1.48",
        "Man City v Brentford: Man City Draw No Bet": "1.35",
        "Tottenham Hotspur v Leeds United: Over 1.5 Goals": "1.57",
        "Liverpool v Chelsea: Both Teams To Score": "1.47",
        "Man City v Brentford: Man City to Win": "1.66",
        "West Ham United v Arsenal: Arsenal to Win": "2.72",
        "Tottenham Hotspur v Leeds United: Over 2.5 Goals": "2.25",
        "Liverpool v Chelsea: Both Teams To Score & Over 2.5 Goals": "2.08",
        "Man City v Brentford: Man City to Win & Over 2.5 Goals": "2.03",
        "West Ham United v Arsenal: Arsenal to Win & Over 2.5 Goals": "2.04",
        "Tottenham Hotspur v Leeds United: Both Teams To Score & Over 2.5 Goals": "2.43"
      },
      "simulatedSlip": {
        "proposalId": "neutral",
        "timelineLabel": "Neutral Strategy",
        "stake": 10,
        "stakePlacedAt": "2026-05-08T20:00:00.000Z",
        "settledAt": "2026-05-09T15:57:00.000Z",
        "settlementKind": "settled",
        "returnAmount": 0,
        "status": "loss",
        "legResults": [
          {
            "betLineLabel": "Liverpool v Chelsea: Both Teams To Score",
            "kickoffAt": "2026-05-09T14:00:00.000Z",
            "settledAt": "2026-05-09T15:57:00.000Z",
            "finalScore": "Liverpool 1-0 Chelsea",
            "status": "lost",
            "actualStatus": "lost"
          },
          {
            "betLineLabel": "Man City v Brentford: Man City to Win",
            "kickoffAt": "2026-05-09T14:00:00.000Z",
            "settledAt": "2026-05-09T15:56:00.000Z",
            "finalScore": "Man City 1-4 Brentford",
            "status": "lost",
            "actualStatus": "lost"
          },
          {
            "betLineLabel": "West Ham United v Arsenal: Arsenal to Win",
            "kickoffAt": "2026-05-09T14:00:00.000Z",
            "settledAt": "2026-05-09T15:52:00.000Z",
            "finalScore": "West Ham United 0-2 Arsenal",
            "status": "won",
            "actualStatus": "won"
          },
          {
            "betLineLabel": "Tottenham Hotspur v Leeds United: Over 2.5 Goals",
            "kickoffAt": "2026-05-09T14:00:00.000Z",
            "settledAt": "2026-05-09T15:51:00.000Z",
            "finalScore": "Tottenham Hotspur 0-0 Leeds United",
            "status": "lost",
            "actualStatus": "lost"
          }
        ]
      }
    },
    {
      "gameWeekId": "md-37",
      "voteResolvedAtIso": "2026-05-15T23:00:00.000Z",
      "betPlacedAtIso": "2026-05-16T20:00:00.000Z",
      "selectedProposalId": "defensive",
      "votesByUserId": {
        "brian-scott": "defensive",
        "tony-mclean": "aggressive",
        "john-colreavey": "defensive",
        "paul-melville": "defensive",
        "alasdair-head": "neutral",
        "paul-devine": "defensive",
        "derek-mcmillan": "aggressive"
      },
      "betLineOddsByLabel": {
        "Arsenal v Burnley: Arsenal Draw No Bet": "1.30",
        "Chelsea v Tottenham Hotspur: Over 1.5 Goals": "1.53",
        "Man Utd v Nottingham Forest: Over 1.5 Goals": "1.55",
        "Bournemouth v Man City: Man City to Win": "2.38",
        "Arsenal v Burnley: Arsenal to Win": "1.58",
        "Chelsea v Tottenham Hotspur: Both Teams To Score": "1.47",
        "Man Utd v Nottingham Forest: Man Utd to Win": "2.00",
        "Bournemouth v Man City: Man City to Win & Over 2.5 Goals": "2.02",
        "Arsenal v Burnley: Arsenal -1 Handicap": "1.88",
        "Chelsea v Tottenham Hotspur: Both Teams To Score & Over 2.5 Goals": "2.16",
        "Man Utd v Nottingham Forest: Man Utd to Win & Over 2.5 Goals": "2.18"
      },
      "simulatedSlip": {
        "proposalId": "defensive",
        "timelineLabel": "Defensive Strategy",
        "stake": 2,
        "stakePlacedAt": "2026-05-16T20:00:00.000Z",
        "settledAt": "2026-05-17T16:20:00.000Z",
        "settlementKind": "cashout",
        "returnAmount": 2.04,
        "status": "win",
        "legResults": [
          {
            "betLineLabel": "Arsenal v Burnley: Arsenal Draw No Bet",
            "kickoffAt": "2026-05-17T14:00:00.000Z",
            "settledAt": "2026-05-17T15:50:00.000Z",
            "finalScore": "Arsenal 1-0 Burnley",
            "status": "won",
            "actualStatus": "won"
          },
          {
            "betLineLabel": "Chelsea v Tottenham Hotspur: Over 1.5 Goals",
            "kickoffAt": "2026-05-17T14:00:00.000Z",
            "settledAt": "2026-05-17T16:04:00.000Z",
            "finalScore": "Chelsea 2-1 Tottenham Hotspur",
            "status": "cashed_out",
            "actualStatus": "won"
          },
          {
            "betLineLabel": "Man Utd v Nottingham Forest: Over 1.5 Goals",
            "kickoffAt": "2026-05-17T14:00:00.000Z",
            "settledAt": "2026-05-17T16:01:00.000Z",
            "finalScore": "Man Utd 3-0 Nottingham Forest",
            "status": "cashed_out",
            "actualStatus": "won"
          }
        ]
      }
    },
    {
      "gameWeekId": "md-38",
      "voteResolvedAtIso": "2026-05-22T23:00:00.000Z",
      "betPlacedAtIso": "2026-05-23T20:00:00.000Z",
      "selectedProposalId": "defensive",
      "votesByUserId": {
        "brian-scott": "defensive",
        "tony-mclean": "neutral",
        "john-colreavey": "defensive",
        "paul-melville": "defensive",
        "alasdair-head": "neutral",
        "paul-devine": "aggressive",
        "derek-mcmillan": "defensive"
      },
      "betLineOddsByLabel": {
        "Liverpool v Brentford: Over 1.5 Goals": "1.51",
        "Man City v Aston Villa: Man City Draw No Bet": "1.46",
        "Tottenham Hotspur v Everton: Over 1.5 Goals": "1.55",
        "Liverpool v Brentford: Liverpool to Win": "1.74",
        "Man City v Aston Villa: Man City to Win": "1.86",
        "Sunderland v Chelsea: Both Teams To Score": "1.64",
        "Tottenham Hotspur v Everton: Tottenham Hotspur to Win": "1.96",
        "Liverpool v Brentford: Liverpool to Win & Over 2.5 Goals": "2.09",
        "Man City v Aston Villa: Both Teams To Score & Over 2.5 Goals": "2.05",
        "Sunderland v Chelsea: Both Teams To Score & Over 2.5 Goals": "2.52",
        "Tottenham Hotspur v Everton: Tottenham Hotspur to Win & Over 2.5 Goals": "2.19"
      },
      "simulatedSlip": {
        "proposalId": "defensive",
        "timelineLabel": "Defensive Strategy",
        "stake": 1,
        "stakePlacedAt": "2026-05-23T20:00:00.000Z",
        "settledAt": "2026-05-24T16:19:00.000Z",
        "settlementKind": "cashout",
        "returnAmount": 1.25,
        "status": "win",
        "legResults": [
          {
            "betLineLabel": "Liverpool v Brentford: Over 1.5 Goals",
            "kickoffAt": "2026-05-24T14:00:00.000Z",
            "settledAt": "2026-05-24T15:49:00.000Z",
            "finalScore": "Liverpool 0-2 Brentford",
            "status": "won",
            "actualStatus": "won"
          },
          {
            "betLineLabel": "Man City v Aston Villa: Man City Draw No Bet",
            "kickoffAt": "2026-05-24T14:00:00.000Z",
            "settledAt": "2026-05-24T15:55:00.000Z",
            "finalScore": "Man City 1-1 Aston Villa",
            "status": "cashed_out",
            "actualStatus": "lost"
          },
          {
            "betLineLabel": "Tottenham Hotspur v Everton: Over 1.5 Goals",
            "kickoffAt": "2026-05-24T14:00:00.000Z",
            "settledAt": "2026-05-24T15:56:00.000Z",
            "finalScore": "Tottenham Hotspur 3-1 Everton",
            "status": "cashed_out",
            "actualStatus": "won"
          }
        ]
      }
    }
  ]
};
