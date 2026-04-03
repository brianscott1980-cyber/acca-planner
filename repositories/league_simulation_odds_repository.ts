import { getCurrentAppDataSnapshot } from "../services/app_data_service";

export function getLeagueSimulationBetLineOddsRows(simulationId: string) {
  return getCurrentAppDataSnapshot().leagueDataBetLineOdds
    .filter((oddsRow) => oddsRow.simulationId === simulationId)
    .sort((left, right) => left.sortOrder - right.sortOrder);
}
