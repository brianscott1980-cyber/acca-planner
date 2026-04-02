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
  "simulatedAtIso": "2026-04-01T23:20:42.822Z",
  "updatedAtIso": "2026-04-01T23:20:42.822Z",
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
    }
  ]
};
