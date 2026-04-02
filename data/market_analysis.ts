export type MarketAnalysisSnapshot = {
  bookmaker: "Ladbrokes";
  snapshotDate: string;
  matchdayId: string;
  selections: MarketAnalysisSelectionRecord[];
};

export type MarketAnalysisSelectionRecord = {
  id: string;
  fixture: string;
  market: string;
  selection: string;
  decimalOdds: number;
};

export const marketAnalysisSnapshots: MarketAnalysisSnapshot[] = [
  {
    bookmaker: "Ladbrokes",
    snapshotDate: "2026-03-31",
    matchdayId: "md-32",
    selections: [
      {
        id: "arsenal-bournemouth-arsenal-dnb",
        fixture: "Arsenal v Bournemouth",
        market: "Draw No Bet",
        selection: "Arsenal",
        decimalOdds: 1.28,
      },
      {
        id: "liverpool-fulham-over-1-5",
        fixture: "Liverpool v Fulham",
        market: "Total Goals",
        selection: "Over 1.5 Goals",
        decimalOdds: 1.22,
      },
      {
        id: "chelsea-man-city-over-1-5",
        fixture: "Chelsea v Man City",
        market: "Total Goals",
        selection: "Over 1.5 Goals",
        decimalOdds: 1.33,
      },
      {
        id: "arsenal-bournemouth-arsenal-win",
        fixture: "Arsenal v Bournemouth",
        market: "Match Result",
        selection: "Arsenal",
        decimalOdds: 1.5,
      },
      {
        id: "liverpool-fulham-liverpool-win",
        fixture: "Liverpool v Fulham",
        market: "Match Result",
        selection: "Liverpool",
        decimalOdds: 1.42,
      },
      {
        id: "chelsea-man-city-btts",
        fixture: "Chelsea v Man City",
        market: "Both Teams To Score",
        selection: "Yes",
        decimalOdds: 1.57,
      },
      {
        id: "man-utd-leeds-over-2-5",
        fixture: "Man Utd v Leeds United",
        market: "Total Goals",
        selection: "Over 2.5 Goals",
        decimalOdds: 1.72,
      },
      {
        id: "arsenal-bournemouth-arsenal-minus-1",
        fixture: "Arsenal v Bournemouth",
        market: "Handicap",
        selection: "Arsenal -1",
        decimalOdds: 1.95,
      },
      {
        id: "liverpool-fulham-liverpool-win-over-2-5",
        fixture: "Liverpool v Fulham",
        market: "Bet Builder",
        selection: "Liverpool to Win & Over 2.5 Goals",
        decimalOdds: 1.83,
      },
      {
        id: "chelsea-man-city-btts-over-2-5",
        fixture: "Chelsea v Man City",
        market: "Bet Builder",
        selection: "Both Teams To Score & Over 2.5 Goals",
        decimalOdds: 1.91,
      },
      {
        id: "man-utd-leeds-man-utd-win-over-2-5",
        fixture: "Man Utd v Leeds United",
        market: "Bet Builder",
        selection: "Man Utd to Win & Over 2.5 Goals",
        decimalOdds: 1.89,
      },
    ],
  },
];
