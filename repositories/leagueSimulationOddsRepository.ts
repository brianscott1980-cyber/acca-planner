import { leagueDataBetLineOdds } from "../data/league_data_bet_line_odds";

export function getSimulationBetLineOddsByLabel(simulationId: string) {
  return leagueDataBetLineOdds
    .filter((oddsRow) => oddsRow.simulationId === simulationId)
    .sort((left, right) => left.order - right.order)
    .reduce<Record<string, string>>((accumulator, oddsRow) => {
      accumulator[oddsRow.betLineLabel] = oddsRow.odds;
      return accumulator;
    }, {});
}
