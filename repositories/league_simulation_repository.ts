import { getCurrentAppDataSnapshot } from "../services/app_data_service";

export function getLeagueMatchdaySimulationRows() {
  return getCurrentAppDataSnapshot().leagueDataMatchdaySimulations;
}

export function getLeagueMatchdaySimulationRowByGameWeekId(gameWeekId: string) {
  return (
    getLeagueMatchdaySimulationRows().find(
      (simulation) => simulation.gameWeekId === gameWeekId,
    ) ?? null
  );
}
