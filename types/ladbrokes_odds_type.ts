import type {
  MarketAnalysisSelectionRow,
  MarketAnalysisSnapshotRow,
} from "./market_analysis_type";

export type LadbrokesSelectionRecord = MarketAnalysisSelectionRow;

export type LadbrokesSnapshotRecord = MarketAnalysisSnapshotRow & {
  selections: MarketAnalysisSelectionRow[];
};
