#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const DATA_DIR = path.join(REPO_ROOT, "data");

const FILES = {
  leagueDataMeta: {
    fileName: "league_data_meta.ts",
    exportName: "leagueDataMeta",
    importType: "LeagueDataMetaRecord",
    typePath: "../types/league_simulation_type",
  },
  leagueDataMatchdaySimulations: {
    fileName: "league_data_matchday_simulations.ts",
    exportName: "leagueDataMatchdaySimulations",
    importType: "LeagueMatchdaySimulationRow",
    typePath: "../types/league_simulation_type",
  },
  leagueDataVotes: {
    fileName: "league_data_votes.ts",
    exportName: "leagueDataVotes",
    importType: "LeagueMatchdayVoteRow",
    typePath: "../types/league_simulation_type",
  },
  leagueDataBetLineOdds: {
    fileName: "league_data_bet_line_odds.ts",
    exportName: "leagueDataBetLineOdds",
    importType: "LeagueMatchdayBetLineOddsRow",
    typePath: "../types/league_simulation_type",
  },
  leagueDataSlips: {
    fileName: "league_data_slips.ts",
    exportName: "leagueDataSlips",
    importType: "LeagueSimulationSlipRow",
    typePath: "../types/league_simulation_type",
  },
  leagueDataLegResults: {
    fileName: "league_data_leg_results.ts",
    exportName: "leagueDataLegResults",
    importType: "LeagueSimulationLegResultRow",
    typePath: "../types/league_simulation_type",
  },
  ledgerData: {
    fileName: "ledger_data.ts",
    exportName: "ledgerData",
    importType: "LedgerTransactionRecord",
    typePath: "../types/ledger_type",
  },
  timelineEvents: {
    fileName: "timeline_events.ts",
    exportName: "timelineEvents",
    importType: "TimelineEventRecord",
    typePath: "../types/timeline_type",
  },
  marketAnalysisSnapshotRows: {
    fileName: "market_analysis_snapshots.ts",
    exportName: "marketAnalysisSnapshotRows",
    importType: "MarketAnalysisSnapshotRow",
    typePath: "../types/market_analysis_type",
  },
  marketAnalysisSelectionRows: {
    fileName: "market_analysis_selections.ts",
    exportName: "marketAnalysisSelectionRows",
    importType: "MarketAnalysisSelectionRow",
    typePath: "../types/market_analysis_type",
  },
  matchdayGameWeeks: {
    fileName: "matchday_game_weeks.ts",
    exportName: "matchdayGameWeeks",
    importType: "MatchdayGameWeekRecord",
    typePath: "../types/matchday_type",
  },
  matchdayProposals: {
    fileName: "matchday_proposals.ts",
    exportName: "matchdayProposals",
    importType: "MatchdayProposalRecord",
    typePath: "../types/matchday_type",
  },
  matchdayBetLines: {
    fileName: "matchday_bet_lines.ts",
    exportName: "matchdayBetLines",
    importType: "MatchdayBetLineRecord",
    typePath: "../types/matchday_type",
  },
  matchdayForms: {
    fileName: "matchday_forms.ts",
    exportName: "matchdayForms",
    importType: "MatchdayFormRecord",
    typePath: "../types/matchday_type",
  },
  matchdayFormMatches: {
    fileName: "matchday_form_matches.ts",
    exportName: "matchdayFormMatches",
    importType: "MatchdayFormMatchRecord",
    typePath: "../types/matchday_type",
  },
  matchdaySeedGameWeeks: {
    fileName: "matchday_seed.ts",
    exportName: "matchdaySeedGameWeeks",
    importType: "GameWeekRecord",
    typePath: "../types/matchday_type",
  },
};

async function main() {
  const isDryRun = process.argv.includes("--dry-run");
  const nowIso = new Date().toISOString();

  const datasets = await loadDatasets();
  const futureGameWeekIds = new Set(
    datasets.matchdayGameWeeks
      .filter((entry) => new Date(entry.windowStartIso).getTime() > Date.parse(nowIso))
      .map((entry) => entry.id),
  );

  const futureSnapshotIds = new Set(
    datasets.marketAnalysisSnapshotRows
      .filter((entry) => futureGameWeekIds.has(entry.matchdayId))
      .map((entry) => entry.id),
  );
  const futureProposalIds = new Set(
    datasets.matchdayProposals
      .filter((entry) => futureGameWeekIds.has(entry.gameWeekId))
      .map((entry) => entry.id),
  );
  const futureBetLineIds = new Set(
    datasets.matchdayBetLines
      .filter((entry) => futureGameWeekIds.has(entry.gameWeekId))
      .map((entry) => entry.id),
  );
  const futureFormIds = new Set(
    datasets.matchdayForms
      .filter((entry) => futureGameWeekIds.has(entry.gameWeekId))
      .map((entry) => entry.id),
  );
  const futureSimulationIds = new Set(
    datasets.leagueDataMatchdaySimulations
      .filter((entry) => futureGameWeekIds.has(entry.gameWeekId))
      .map((entry) => entry.id),
  );
  const futureSlipIds = new Set(
    datasets.leagueDataSlips
      .filter((entry) => futureGameWeekIds.has(entry.gameWeekId))
      .map((entry) => entry.id),
  );

  const nextDatasets = {
    ...datasets,
    leagueDataMatchdaySimulations: datasets.leagueDataMatchdaySimulations.filter(
      (entry) => !futureGameWeekIds.has(entry.gameWeekId),
    ),
    leagueDataVotes: datasets.leagueDataVotes.filter(
      (entry) => !futureGameWeekIds.has(entry.gameWeekId) && !futureSimulationIds.has(entry.simulationId),
    ),
    leagueDataBetLineOdds: datasets.leagueDataBetLineOdds.filter(
      (entry) => !futureGameWeekIds.has(entry.gameWeekId) && !futureSimulationIds.has(entry.simulationId),
    ),
    leagueDataSlips: datasets.leagueDataSlips.filter(
      (entry) => !futureGameWeekIds.has(entry.gameWeekId) && !futureSimulationIds.has(entry.simulationId),
    ),
    leagueDataLegResults: datasets.leagueDataLegResults.filter(
      (entry) =>
        !futureGameWeekIds.has(entry.gameWeekId) &&
        !futureSimulationIds.has(entry.simulationId) &&
        !futureSlipIds.has(entry.slipId),
    ),
    ledgerData: datasets.ledgerData.filter(
      (entry) => new Date(entry.dateIso).getTime() <= Date.parse(nowIso),
    ),
    timelineEvents: datasets.timelineEvents.filter(
      (entry) =>
        new Date(entry.timestampIso).getTime() <= Date.parse(nowIso) &&
        !(entry.matchdayId && futureGameWeekIds.has(entry.matchdayId)),
    ),
    marketAnalysisSnapshotRows: datasets.marketAnalysisSnapshotRows.filter(
      (entry) => !futureGameWeekIds.has(entry.matchdayId),
    ),
    marketAnalysisSelectionRows: datasets.marketAnalysisSelectionRows.filter(
      (entry) => !futureSnapshotIds.has(entry.snapshotId),
    ),
    matchdayGameWeeks: datasets.matchdayGameWeeks.filter(
      (entry) => !futureGameWeekIds.has(entry.id),
    ),
    matchdayProposals: datasets.matchdayProposals.filter(
      (entry) => !futureGameWeekIds.has(entry.gameWeekId),
    ),
    matchdayBetLines: datasets.matchdayBetLines.filter(
      (entry) =>
        !futureGameWeekIds.has(entry.gameWeekId) &&
        !futureProposalIds.has(entry.proposalEntityId),
    ),
    matchdayForms: datasets.matchdayForms.filter(
      (entry) =>
        !futureGameWeekIds.has(entry.gameWeekId) &&
        !futureBetLineIds.has(entry.betLineId),
    ),
    matchdayFormMatches: datasets.matchdayFormMatches.filter(
      (entry) => !futureFormIds.has(entry.formId),
    ),
    matchdaySeedGameWeeks: datasets.matchdaySeedGameWeeks.filter(
      (entry) => new Date(entry.windowStartIso).getTime() <= Date.parse(nowIso),
    ),
  };

  const counts = Object.fromEntries(
    Object.keys(FILES).map((key) => [
      key,
      datasets[key].length - nextDatasets[key].length,
    ]),
  );
  const totalRemoved = Object.values(counts).reduce((sum, count) => sum + count, 0);

  if (futureGameWeekIds.size === 0 && totalRemoved === 0) {
    process.stdout.write("No future local rows were found to clear.\n");
    return;
  }

  process.stdout.write(
    `${isDryRun ? "Dry run" : "Preparing"} local future cleanup as of ${nowIso}.\n`,
  );

  if (futureGameWeekIds.size > 0) {
    process.stdout.write("\nFuture local matchdays:\n");
    for (const gameWeek of datasets.matchdayGameWeeks.filter((entry) => futureGameWeekIds.has(entry.id))) {
      process.stdout.write(
        `- ${gameWeek.name ?? gameWeek.id} (${gameWeek.id}) starts ${gameWeek.windowStartIso}\n`,
      );
    }
  }

  process.stdout.write("\nRows matched for cleanup:\n");
  for (const [key, count] of Object.entries(counts)) {
    if (count <= 0) {
      continue;
    }

    process.stdout.write(`- ${FILES[key].fileName}: ${count}\n`);
  }

  process.stdout.write(`\nTotal rows matched: ${totalRemoved}\n`);

  if (isDryRun) {
    process.stdout.write("\nDry run only. No local files were rewritten.\n");
    return;
  }

  await mkdir(DATA_DIR, { recursive: true });
  await Promise.all(
    Object.entries(FILES).map(async ([key, config]) => {
      await writeDataFile(config, nextDatasets[key]);
    }),
  );

  process.stdout.write("\nFuture local rows deleted successfully.\n");
}

async function loadDatasets() {
  const entries = await Promise.all(
    Object.entries(FILES).map(async ([key, config]) => [key, await loadTsExport(config)]),
  );

  return Object.fromEntries(entries);
}

async function loadTsExport(config) {
  const sourcePath = path.join(DATA_DIR, config.fileName);
  const source = await readFile(sourcePath, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: sourcePath,
  });
  const encodedSource = Buffer.from(transpiled.outputText, "utf8").toString("base64");
  const moduleUrl = `data:text/javascript;base64,${encodedSource}`;
  const importedModule = await import(moduleUrl);

  return importedModule[config.exportName] ?? [];
}

async function writeDataFile(config, rows) {
  const fileContents = `${[
    `import type { ${config.importType} } from "${config.typePath}";`,
    "",
    `export const ${config.exportName}: ${config.importType}[] = ${JSON.stringify(rows, null, 2)};`,
    "",
  ].join("\n")}`;

  await writeFile(path.join(DATA_DIR, config.fileName), fileContents);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
