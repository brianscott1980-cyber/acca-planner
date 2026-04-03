import { leagueDataBetLineOdds } from "../data/league_data_bet_line_odds";

export function getLeagueSimulationBetLineOddsRows(simulationId: string) {
  return leagueDataBetLineOdds
    .filter((oddsRow) => oddsRow.simulationId === simulationId)
    .sort((left, right) => left.sortOrder - right.sortOrder);
}
