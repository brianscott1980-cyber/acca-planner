#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "../..");
const DATA_DIR = path.join(REPO_ROOT, "data");

async function main() {
  const nowIso = new Date().toISOString();

  await mkdir(DATA_DIR, { recursive: true });

  await Promise.all([
    writeDataFile(
      "league_data_meta.ts",
      `import type { LeagueDataMetaRecord } from "../types/league_simulation_type";

export const leagueDataMeta: LeagueDataMetaRecord[] = [
  {
    id: "primary",
    simulatedAtIso: ${JSON.stringify(nowIso)},
    updatedAtIso: ${JSON.stringify(nowIso)},
  },
];
`,
    ),
    writeDataFile(
      "league_data_matchday_simulations.ts",
      `import type { LeagueMatchdaySimulationRow } from "../types/league_simulation_type";

export const leagueDataMatchdaySimulations: LeagueMatchdaySimulationRow[] = [];
`,
    ),
    writeDataFile(
      "league_data_votes.ts",
      `import type { LeagueMatchdayVoteRow } from "../types/league_simulation_type";

export const leagueDataVotes: LeagueMatchdayVoteRow[] = [];
`,
    ),
    writeDataFile(
      "league_data_bet_line_odds.ts",
      `import type { LeagueMatchdayBetLineOddsRow } from "../types/league_simulation_type";

export const leagueDataBetLineOdds: LeagueMatchdayBetLineOddsRow[] = [];
`,
    ),
    writeDataFile(
      "league_data_slips.ts",
      `import type { LeagueSimulationSlipRow } from "../types/league_simulation_type";

export const leagueDataSlips: LeagueSimulationSlipRow[] = [];
`,
    ),
    writeDataFile(
      "league_data_leg_results.ts",
      `import type { LeagueSimulationLegResultRow } from "../types/league_simulation_type";

export const leagueDataLegResults: LeagueSimulationLegResultRow[] = [];
`,
    ),
    writeDataFile(
      "ledger_data.ts",
      `import type { LedgerTransactionRecord } from "../types/ledger_type";

export const ledgerData: LedgerTransactionRecord[] = [
  {
    id: "deposit-brian-scott",
    title: "Brian Scott Deposit",
    dateIso: "2026-03-23T09:00:00.000Z",
    amount: 10,
    kind: "deposit",
  },
  {
    id: "deposit-tony-mclean",
    title: "Tony McLean Deposit",
    dateIso: "2026-03-23T09:00:00.000Z",
    amount: 10,
    kind: "deposit",
  },
  {
    id: "deposit-john-colreavey",
    title: "John Colreavey Deposit",
    dateIso: "2026-03-23T09:00:00.000Z",
    amount: 10,
    kind: "deposit",
  },
  {
    id: "deposit-paul-melville",
    title: "Paul Melville Deposit",
    dateIso: "2026-03-23T09:00:00.000Z",
    amount: 10,
    kind: "deposit",
  },
  {
    id: "deposit-alasdair-head",
    title: "Alasdair Head Deposit",
    dateIso: "2026-03-23T09:00:00.000Z",
    amount: 10,
    kind: "deposit",
  },
  {
    id: "deposit-paul-devine",
    title: "Paul Devine Deposit",
    dateIso: "2026-03-23T09:00:00.000Z",
    amount: 10,
    kind: "deposit",
  },
  {
    id: "deposit-derek-mcmillan",
    title: "Derek McMillan Deposit",
    dateIso: "2026-03-23T09:00:00.000Z",
    amount: 10,
    kind: "deposit",
  },
];
`,
    ),
    writeDataFile(
      "timeline_events.ts",
      `import type { TimelineEventRecord } from "../types/timeline_type";

export const timelineEvents: TimelineEventRecord[] = [];
`,
    ),
    writeDataFile(
      "market_analysis_snapshots.ts",
      `import type { MarketAnalysisSnapshotRow } from "../types/market_analysis_type";

export const marketAnalysisSnapshotRows: MarketAnalysisSnapshotRow[] = [];
`,
    ),
    writeDataFile(
      "market_analysis_selections.ts",
      `import type { MarketAnalysisSelectionRow } from "../types/market_analysis_type";

export const marketAnalysisSelectionRows: MarketAnalysisSelectionRow[] = [];
`,
    ),
    writeDataFile(
      "matchday_game_weeks.ts",
      `import type { MatchdayGameWeekRecord } from "../types/matchday_type";

export const matchdayGameWeeks: MatchdayGameWeekRecord[] = [];
`,
    ),
    writeDataFile(
      "matchday_proposals.ts",
      `import type { MatchdayProposalRecord } from "../types/matchday_type";

export const matchdayProposals: MatchdayProposalRecord[] = [];
`,
    ),
    writeDataFile(
      "matchday_bet_lines.ts",
      `import type { MatchdayBetLineRecord } from "../types/matchday_type";

export const matchdayBetLines: MatchdayBetLineRecord[] = [];
`,
    ),
    writeDataFile(
      "matchday_forms.ts",
      `import type { MatchdayFormRecord } from "../types/matchday_type";

export const matchdayForms: MatchdayFormRecord[] = [];
`,
    ),
    writeDataFile(
      "matchday_form_matches.ts",
      `import type { MatchdayFormMatchRecord } from "../types/matchday_type";

export const matchdayFormMatches: MatchdayFormMatchRecord[] = [];
`,
    ),
    writeDataFile(
      "matchday_seed.ts",
      `import type { GameWeekRecord } from "../types/matchday_type";

export const matchdaySeedGameWeeks: GameWeekRecord[] = [];
`,
    ),
  ]);

  process.stdout.write(
    "Reset local matchday, market analysis, league simulation, timeline, and ledger data files to a clean baseline with the opening deposits restored.\n",
  );
}

async function writeDataFile(fileName, fileContents) {
  await writeFile(path.join(DATA_DIR, fileName), fileContents);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
