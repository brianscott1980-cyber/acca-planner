export type CustomBetSport = "horse_racing" | "football" | "golf";
export type CustomBetBookmaker = "Ladbrokes";
export type CustomBetState = "pending" | "staked";
export type CustomBetType = "standard" | "free_bet_offer";

export type CustomBetRecommendation = {
  rank: 1 | 2 | 3;
  market: string;
  selection: string;
  decimalOdds: number;
  suggestedStakeAmount?: number;
  summary: string;
  horseRacing?: {
    trainer?: string;
    jockey?: string;
    silksImagePath?: string;
    silksSourceUrl?: string;
    age?: number;
    weight?: string;
    officialRating?: number;
    recentForm?: string;
    owner?: string;
  };
};

export type HorseRacingRival = {
  name: string;
  silksImagePath?: string;
  silksSourceUrl?: string;
  age?: number;
  weight?: string;
  recentForm?: string;
};

export type HorseRacingCustomBetDetails = {
  racecourse: string;
  raceTimeNote: string;
  horseName: string;
  trainer: string;
  jockey: string;
  silksImagePath?: string;
  silksSourceUrl?: string;
  age?: number;
  weight?: string;
  officialRating?: number;
  recentForm?: string;
  owner?: string;
  going?: string;
  distance?: string;
  fieldSize?: number;
  notableRivals: HorseRacingRival[];
};

export type FootballCustomBetDetails = {
  fixture: string;
  kickoffNote: string;
  competition: string;
  marketType: string;
  teamNews: string[];
  tacticalAngles: string[];
};

export type GolfCustomBetDetails = {
  tournament: string;
  course: string;
  marketType: string;
  playerName: string;
  eachWayTerms?: string;
  keyStats: string[];
  fieldAngles: string[];
};

export type CustomBetRecord = {
  id: string;
  slug: string;
  title: string;
  state: CustomBetState;
  customBetType?: CustomBetType;
  sport: CustomBetSport;
  bookmaker: CustomBetBookmaker;
  eventName: string;
  competitionName: string;
  bettingFormatRequested: string;
  proposedBets: CustomBetRecommendation[];
  recommendedMarket: string;
  recommendedSelection: string;
  decimalOdds: number;
  summary: string;
  analysisSummary: string;
  mediaSummary: string;
  timelineTitle: string;
  timelineDescription: string;
  generatedAtIso: string;
  eventStartIso: string;
  eventEndIso?: string;
  suggestedStakeAmount?: number;
  isFreeStake?: boolean;
  placedProposalRank?: 1 | 2 | 3;
  placedMarket?: string;
  placedSelection?: string;
  stakeAmount?: number;
  placedDecimalOdds?: number;
  placedAtIso?: string;
  outcomeStatus?: "won" | "lost" | "cashed_out";
  outcomeValueAmount?: number;
  outcomeAtIso?: string;
  outcomeSummary?: string;
  outcomeSubmittedBy?: string;
  cashoutLowerTarget: string;
  cashoutUpperTarget: string;
  noCashoutValue: string;
  cashoutAdvice: string[];
  watchPoints: string[];
  riskFactors: string[];
  horseRacing?: HorseRacingCustomBetDetails;
  football?: FootballCustomBetDetails;
  golf?: GolfCustomBetDetails;
};
