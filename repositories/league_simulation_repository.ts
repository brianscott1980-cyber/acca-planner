import { leagueDataMatchdaySimulations } from "../data/league_data_matchday_simulations";

export function getLeagueMatchdaySimulationRows() {
  return leagueDataMatchdaySimulations;
}

export function getLeagueMatchdaySimulationRowByGameWeekId(gameWeekId: string) {
  return (
    leagueDataMatchdaySimulations.find(
      (simulation) => simulation.gameWeekId === gameWeekId,
    ) ?? null
  );
}
