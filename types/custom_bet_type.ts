export type CustomBetSport = "horse_racing" | "football" | "golf";
export type CustomBetBookmaker = "Ladbrokes";
export type CustomBetState = "pending" | "staked";

export type HorseRacingCustomBetDetails = {
  racecourse: string;
  raceTimeNote: string;
  horseName: string;
  trainer: string;
  jockey: string;
  going?: string;
  distance?: string;
  fieldSize?: number;
  notableRivals: string[];
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
  sport: CustomBetSport;
  bookmaker: CustomBetBookmaker;
  eventName: string;
  competitionName: string;
  bettingFormatRequested: string;
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
  stakeAmount?: number;
  placedDecimalOdds?: number;
  placedAtIso?: string;
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
