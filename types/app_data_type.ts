import type { LeagueClubRecord } from "./league_club_type";
import type {
  CustomBetOutcomeRow,
  LeagueDataMetaRecord,
  LeagueMatchdayBetLineOddsRow,
  LeagueMatchdaySimulationRow,
  LeagueMatchdayVoteRow,
  MatchdayOutcomeRow,
  LeagueSimulationLegResultRow,
  LeagueSimulationSlipRow,
} from "./league_simulation_type";
import type { LedgerTransactionRecord } from "./ledger_type";
import type {
  MarketAnalysisSelectionRow,
  MarketAnalysisSnapshotRow,
} from "./market_analysis_type";
import type { TimelineEventRecord } from "./timeline_type";
import type { CustomBetRecord } from "./custom_bet_type";
import type { BetLearningFeedbackRecord } from "./bet_learning_feedback_type";
import type {
  MatchdayBetLineRecord,
  MatchdayFormMatchRecord,
  MatchdayFormRecord,
  MatchdayGameWeekRecord,
  MatchdayProposalRecord,
} from "./matchday_type";
import type { UserRecord } from "./user_type";

export type AppDataSnapshot = {
  users: UserRecord[];
  leagueClubs: LeagueClubRecord[];
  marketAnalysisSnapshotRows: MarketAnalysisSnapshotRow[];
  marketAnalysisSelectionRows: MarketAnalysisSelectionRow[];
  matchdayGameWeeks: MatchdayGameWeekRecord[];
  matchdayProposals: MatchdayProposalRecord[];
  matchdayBetLines: MatchdayBetLineRecord[];
  matchdayForms: MatchdayFormRecord[];
  matchdayFormMatches: MatchdayFormMatchRecord[];
  customBets: CustomBetRecord[];
  leagueDataMeta: LeagueDataMetaRecord[];
  leagueDataMatchdaySimulations: LeagueMatchdaySimulationRow[];
  leagueDataVotes: LeagueMatchdayVoteRow[];
  leagueDataBetLineOdds: LeagueMatchdayBetLineOddsRow[];
  leagueDataSlips: LeagueSimulationSlipRow[];
  leagueDataLegResults: LeagueSimulationLegResultRow[];
  matchdayOutcomes: MatchdayOutcomeRow[];
  customBetOutcomes: CustomBetOutcomeRow[];
  betLearningFeedback: BetLearningFeedbackRecord[];
  ledgerData: LedgerTransactionRecord[];
  timelineEvents: TimelineEventRecord[];
};
