export type MarketAnalysisBookmaker = "Ladbrokes";

export type MarketAnalysisSnapshotRow = {
  id: string;
  bookmaker: MarketAnalysisBookmaker;
  snapshotDate: string;
  matchdayId: string;
};

export type MarketAnalysisSelectionRow = {
  id: string;
  snapshotId: string;
  fixture: string;
  market: string;
  selection: string;
  decimalOdds: number;
};
