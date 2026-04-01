import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import ts from "typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..", "..");

const CLUB_STRENGTHS = {
  arsenal: 87,
  "aston villa": 80,
  bournemouth: 74,
  brentford: 73,
  brighton: 78,
  burnley: 68,
  chelsea: 81,
  "crystal palace": 73,
  everton: 74,
  fulham: 74,
  "leeds united": 69,
  liverpool: 86,
  "manchester city": 89,
  "manchester united": 80,
  "newcastle united": 80,
  "nottingham forest": 75,
  sunderland: 66,
  "tottenham hotspur": 80,
  "west ham united": 76,
  "wolverhampton wanderers": 72,
};

const CLUB_ALIASES = {
  "man utd": "manchester united",
  "man city": "manchester city",
  newcastle: "newcastle united",
  "newcastle utd": "newcastle united",
  tottenham: "tottenham hotspur",
  wolves: "wolverhampton wanderers",
  "west ham": "west ham united",
  brighton: "brighton",
};

async function main() {
  const [command, ...rest] = process.argv.slice(2);

  if (command !== "reset" && command !== "date") {
    throw new Error(
      'Use "reset" or "date". Example: npm run simulate:league:date -- "2026-04-20 19:30"',
    );
  }

  const simulatedAt =
    command === "reset"
      ? new Date()
      : parseShortDateTime(rest.join(" ").trim());
  const updatedAt = new Date();
  const [{ users }, { gameWeeks }, { ladbrokesOddsSnapshots }] = await Promise.all([
    loadTsModule("data/users.ts"),
    loadTsModule("data/gameWeeks.ts"),
    loadTsModule("data/ladbrokesOdds.ts"),
  ]);
  const matchdaySimulations = buildMatchdaySimulations({
    users,
    gameWeeks,
    ladbrokesOddsSnapshots,
  });
  const ledgerTransactions = buildLedgerTransactions({
    users,
    matchdaySimulations,
    simulatedAt,
  });

  await mkdir(path.join(ROOT, "data"), { recursive: true });
  await writeFile(
    path.join(ROOT, "data", "leagueData.ts"),
    renderLeagueData({
      simulatedAtIso: simulatedAt.toISOString(),
      updatedAtIso: updatedAt.toISOString(),
      matchdaySimulations,
    }),
  );
  await writeFile(
    path.join(ROOT, "data", "ledgerData.ts"),
    renderLedgerData(ledgerTransactions),
  );

  console.log(
    [
      `Simulated league date set to ${simulatedAt.toISOString()}.`,
      `Generated ${ledgerTransactions.length} ledger transactions.`,
      `Prepared ${matchdaySimulations.length} matchday simulations.`,
    ].join(" "),
  );
}

function parseShortDateTime(input) {
  const match = input.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{1,2})(?::(\d{2}))?)?$/,
  );

  if (!match) {
    throw new Error(
      'Expected "YYYY-MM-DD" or "YYYY-MM-DD HH:mm". Example: 2026-04-20 19:30',
    );
  }

  const [, year, month, day, hours = "12", minutes = "00"] = match;
  const parsedDate = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
  );

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(`Could not parse date "${input}".`);
  }

  return parsedDate;
}

async function loadTsModule(relativePath) {
  const absolutePath = path.join(ROOT, relativePath);
  const source = await readFile(absolutePath, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: absolutePath,
  });

  return import(
    `data:text/javascript;base64,${Buffer.from(output.outputText).toString("base64")}`
  );
}

function buildMatchdaySimulations({ users, gameWeeks, ladbrokesOddsSnapshots }) {
  const sortedGameWeeks = [...gameWeeks].sort(
    (left, right) =>
      new Date(left.windowStartIso).getTime() -
      new Date(right.windowStartIso).getTime(),
  );
  const initialPotTotal = users.length * 10;
  let runningPot = initialPotTotal;
  let completedGameWeeks = 0;

  return sortedGameWeeks.map((gameWeek) => {
    const voteResolvedAt = addHours(new Date(gameWeek.windowStartIso), -72);
    const betPlacedAt = addHours(new Date(gameWeek.windowStartIso), -18);
    const betLineOddsByLabel = buildBetLineOddsByLabel(
      gameWeek,
      ladbrokesOddsSnapshots,
    );
    const votesByUserId = buildVotesByUserId({
      users,
      gameWeek,
      betLineOddsByLabel,
    });
    const selectedProposalId = getWinningProposalId({
      gameWeek,
      votesByUserId,
    });
    const selectedProposal = findProposal(gameWeek, selectedProposalId);
    const selectedProposalOdds = getProposalDecimalOdds(
      selectedProposal,
      betLineOddsByLabel,
    );
    const aggressiveProposal =
      gameWeek.proposals.find((proposal) => proposal.riskLevel === "aggressive") ??
      selectedProposal;
    const aggressiveOdds = getProposalDecimalOdds(
      aggressiveProposal,
      betLineOddsByLabel,
    );
    const stake = getRecommendedStake({
      currentPot: runningPot,
      initialPotTotal,
      completedGameWeeks,
      proposalOdds: selectedProposalOdds,
      aggressiveOdds,
      isAggressive: selectedProposal.id === aggressiveProposal.id,
    });
    const simulatedSlip = buildSimulatedSlip({
      gameWeek,
      proposal: selectedProposal,
      proposalOdds: selectedProposalOdds,
      stake,
      betPlacedAt,
    });

    runningPot = roundCurrency(
      runningPot - simulatedSlip.stake + simulatedSlip.returnAmount,
    );
    completedGameWeeks += 1;

    return {
      gameWeekId: gameWeek.id,
      voteResolvedAtIso: voteResolvedAt.toISOString(),
      betPlacedAtIso: betPlacedAt.toISOString(),
      selectedProposalId,
      votesByUserId,
      betLineOddsByLabel,
      simulatedSlip,
    };
  });
}

function buildVotesByUserId({ users, gameWeek, betLineOddsByLabel }) {
  const proposalWeights = gameWeek.proposals.map((proposal) => {
    const proposalOdds = getProposalDecimalOdds(proposal, betLineOddsByLabel);
    const baseWeight =
      proposal.riskLevel === "safe"
        ? 1.08
        : proposal.riskLevel === "balanced"
          ? 1.2
          : 0.82;
    const oddsWeight = clamp(2.8 / proposalOdds, 0.68, 1.22);

    return {
      proposalId: proposal.id,
      weight: baseWeight * oddsWeight,
    };
  });

  return Object.fromEntries(
    users.map((user) => {
      const rng = createPrng(`${gameWeek.id}:${user.id}:vote`);
      const vote = pickWeightedProposal(proposalWeights, rng);
      return [user.id, vote];
    }),
  );
}

function buildBetLineOddsByLabel(gameWeek, ladbrokesOddsSnapshots) {
  const snapshotSelections =
    ladbrokesOddsSnapshots.find((snapshot) => snapshot.matchdayId === gameWeek.id)
      ?.selections ?? [];
  const snapshotOddsById = Object.fromEntries(
    snapshotSelections.map((selection) => [selection.id, selection.decimalOdds]),
  );
  const betLineOddsByLabel = {};

  for (const proposal of gameWeek.proposals) {
    for (const betLine of proposal.betLines) {
      if (betLineOddsByLabel[betLine.label]) {
        continue;
      }

      const decimalOdds =
        (betLine.marketId && snapshotOddsById[betLine.marketId]) ??
        simulateBetLineOdds(betLine.label);

      betLineOddsByLabel[betLine.label] = decimalOdds.toFixed(2);
    }
  }

  return betLineOddsByLabel;
}

function simulateBetLineOdds(label) {
  const [fixtureLabel, marketLabel] = label.split(":").map((part) => part.trim());
  const [homeTeam, awayTeam] = fixtureLabel
    .split(/\s+v(?:s)?\s+/i)
    .map((team) => team.trim());
  const homeStrength = getClubStrength(homeTeam);
  const awayStrength = getClubStrength(awayTeam);
  const { homeWinProb, drawProb, awayWinProb, over15Prob, over25Prob, bttsProb, awayScoreProb } =
    getFixtureProbabilities(homeStrength, awayStrength);
  let probability = 0.5;

  if (/draw no bet/i.test(marketLabel)) {
    const team = marketLabel.replace(/draw no bet/i, "").trim();
    const teamWinProb = isHomeTeamSelection(team, homeTeam)
      ? homeWinProb
      : awayWinProb;
    probability = teamWinProb / (1 - drawProb);
  } else if (/both teams to score\s*&\s*over 2\.5 goals/i.test(marketLabel)) {
    probability = bttsProb * clamp(over25Prob + 0.18, 0.42, 0.92);
  } else if (/both teams to score/i.test(marketLabel)) {
    probability = bttsProb;
  } else if (/over 1\.5 goals/i.test(marketLabel)) {
    probability = over15Prob;
  } else if (/over 2\.5 goals/i.test(marketLabel)) {
    probability = over25Prob;
  } else if (/win to nil/i.test(marketLabel)) {
    const team = marketLabel.replace(/win to nil/i, "").trim();
    const teamWinProb = isHomeTeamSelection(team, homeTeam)
      ? homeWinProb
      : awayWinProb;
    const scoringProb = isHomeTeamSelection(team, homeTeam)
      ? awayScoreProb
      : clamp(0.52 + (homeStrength - 72) / 50, 0.22, 0.78);
    probability = teamWinProb * (1 - scoringProb) * 1.04;
  } else if (/to win\s*&\s*both teams to score/i.test(marketLabel)) {
    const team = marketLabel.replace(/to win\s*&\s*both teams to score/i, "").trim();
    const teamWinProb = isHomeTeamSelection(team, homeTeam)
      ? homeWinProb
      : awayWinProb;
    probability = teamWinProb * bttsProb * 0.96;
  } else if (/to win\s*&\s*over 2\.5 goals/i.test(marketLabel)) {
    const team = marketLabel.replace(/to win\s*&\s*over 2\.5 goals/i, "").trim();
    const teamWinProb = isHomeTeamSelection(team, homeTeam)
      ? homeWinProb
      : awayWinProb;
    probability = teamWinProb * over25Prob * 1.08;
  } else if (/-1 handicap/i.test(marketLabel)) {
    const team = marketLabel.replace(/-1 handicap/i, "").trim();
    const teamWinProb = isHomeTeamSelection(team, homeTeam)
      ? homeWinProb
      : awayWinProb;
    probability = teamWinProb * clamp(0.62 + Math.abs(homeStrength - awayStrength) / 60, 0.46, 0.84);
  } else if (/to win/i.test(marketLabel)) {
    const team = marketLabel.replace(/to win/i, "").trim();
    probability = isHomeTeamSelection(team, homeTeam)
      ? homeWinProb
      : awayWinProb;
  }

  return clamp(roundCurrency((1 / clamp(probability, 0.08, 0.92)) * 1.06), 1.12, 8.5);
}

function getFixtureProbabilities(homeStrength, awayStrength) {
  const normalizedDiff = (homeStrength + 4 - awayStrength) / 12;
  let homeWinProb = clamp(0.44 + normalizedDiff * 0.12, 0.24, 0.74);
  let drawProb = clamp(0.27 - Math.abs(normalizedDiff) * 0.05, 0.18, 0.31);
  let awayWinProb = clamp(1 - homeWinProb - drawProb, 0.11, 0.46);
  const probabilityTotal = homeWinProb + drawProb + awayWinProb;

  homeWinProb /= probabilityTotal;
  drawProb /= probabilityTotal;
  awayWinProb /= probabilityTotal;

  const attackLevel = clamp((homeStrength + awayStrength - 140) / 70, 0, 0.55);
  const mismatch = Math.abs(homeStrength - awayStrength) / 40;
  const over15Prob = clamp(0.64 + attackLevel * 0.18 + mismatch * 0.04, 0.57, 0.9);
  const over25Prob = clamp(0.43 + attackLevel * 0.24 + mismatch * 0.04, 0.3, 0.78);
  const bttsProb = clamp(
    0.46 + attackLevel * 0.12 - mismatch * 0.08 + Math.min(homeStrength, awayStrength) / 320,
    0.28,
    0.72,
  );
  const awayScoreProb = clamp(
    0.49 + (awayStrength - 72) / 45 - (homeStrength - 78) / 70 + attackLevel * 0.08,
    0.18,
    0.76,
  );

  return {
    homeWinProb,
    drawProb,
    awayWinProb,
    over15Prob,
    over25Prob,
    bttsProb,
    awayScoreProb,
  };
}

function buildSimulatedSlip({ gameWeek, proposal, proposalOdds, stake, betPlacedAt }) {
  const rng = createPrng(`${gameWeek.id}:${proposal.id}:settlement`);
  const fairWinProbability = clamp(1 / (proposalOdds * 1.06), 0.12, 0.72);
  const won = rng() < fairWinProbability;
  const cashoutChance =
    proposal.riskLevel === "safe"
      ? 0.52
      : proposal.riskLevel === "balanced"
        ? 0.4
        : 0.28;
  const settlementKind =
    rng() < (won ? cashoutChance : cashoutChance * 0.82) ? "cashout" : "settled";
  const fullReturn = roundCurrency(stake * proposalOdds);
  let returnAmount = 0;

  if (settlementKind === "cashout") {
    if (won) {
      returnAmount = roundCurrency(
        Math.max(stake * 1.12, fullReturn * (0.4 + rng() * 0.24)),
      );
    } else {
      returnAmount = roundCurrency(stake * (0.34 + rng() * 0.42));
    }
  } else if (won) {
    returnAmount = fullReturn;
  }

  const settledAt =
    settlementKind === "cashout"
      ? addHours(new Date(gameWeek.windowEndIso), -(4 + Math.floor(rng() * 8)))
      : addMinutes(new Date(gameWeek.windowEndIso), -5);

  return {
    proposalId: proposal.id,
    timelineLabel: `${proposal.title} Strategy`,
    stake,
    stakePlacedAt: betPlacedAt.toISOString(),
    settledAt: settledAt.toISOString(),
    settlementKind,
    returnAmount,
    status: won ? "win" : "loss",
  };
}

function buildLedgerTransactions({ users, matchdaySimulations, simulatedAt }) {
  const transactions = users.map((user) => ({
    id: `deposit-${user.id}`,
    title: user.displayName,
    dateIso: buildJoinedOnDateIso(user.joinedOn),
    amount: 10,
    kind: "deposit",
  }));

  for (const simulation of matchdaySimulations) {
    if (
      new Date(simulation.simulatedSlip.stakePlacedAt).getTime() <= simulatedAt.getTime()
    ) {
      transactions.push({
        id: `stake-${simulation.gameWeekId}`,
        title: `${formatMatchdayLabel(simulation.gameWeekId)} ${formatProposalTitle(simulation.selectedProposalId)} Stake`,
        dateIso: simulation.simulatedSlip.stakePlacedAt,
        amount: -Math.abs(simulation.simulatedSlip.stake),
        kind: "stake",
        gameWeekId: simulation.gameWeekId,
        proposalId: simulation.selectedProposalId,
      });
    }

    if (
      new Date(simulation.simulatedSlip.settledAt).getTime() <= simulatedAt.getTime() &&
      simulation.simulatedSlip.returnAmount > 0
    ) {
      transactions.push({
        id: `settlement-${simulation.gameWeekId}`,
        title: `${formatMatchdayLabel(simulation.gameWeekId)} ${formatSettlementLabel(simulation.simulatedSlip.settlementKind)} return`,
        dateIso: simulation.simulatedSlip.settledAt,
        amount: simulation.simulatedSlip.returnAmount,
        kind: "settlement",
        gameWeekId: simulation.gameWeekId,
        proposalId: simulation.selectedProposalId,
      });
    }
  }

  return transactions.sort(
    (left, right) =>
      new Date(left.dateIso).getTime() - new Date(right.dateIso).getTime(),
  );
}

function getRecommendedStake({
  currentPot,
  initialPotTotal,
  completedGameWeeks,
  proposalOdds,
  aggressiveOdds,
  isAggressive,
}) {
  const aggressiveStake = calculateAggressiveStake({
    currentPot,
    initialPotTotal,
    completedGameWeeks,
  });

  if (isAggressive) {
    return aggressiveStake;
  }

  return Math.max(1, Math.round(aggressiveStake * (proposalOdds / aggressiveOdds)));
}

function calculateAggressiveStake({
  currentPot,
  initialPotTotal,
  completedGameWeeks,
}) {
  if (currentPot <= 0) {
    return 0;
  }

  const progressRatio = clamp(completedGameWeeks / 12, 0, 1);
  const growthRatio =
    initialPotTotal <= 0 ? 0 : (currentPot - initialPotTotal) / initialPotTotal;
  const profitRatio = Math.max(growthRatio, 0);
  const drawdownRatio = Math.max(-growthRatio, 0);
  const aggressiveRate = clamp(
    0.44 + progressRatio * 0.04 + profitRatio * 0.05 - drawdownRatio * 0.04,
    0.4,
    0.55,
  );

  return Math.max(1, Math.round(currentPot * aggressiveRate));
}

function getProposalDecimalOdds(proposal, betLineOddsByLabel) {
  return proposal.betLines.reduce(
    (total, betLine) =>
      total * Number.parseFloat(betLineOddsByLabel[betLine.label] ?? betLine.odds ?? "1"),
    1,
  );
}

function getWinningProposalId({ gameWeek, votesByUserId }) {
  const voteCounts = Object.fromEntries(gameWeek.proposals.map((proposal) => [proposal.id, 0]));

  for (const proposalId of Object.values(votesByUserId)) {
    voteCounts[proposalId] = (voteCounts[proposalId] ?? 0) + 1;
  }

  const highestCount = Math.max(...Object.values(voteCounts));
  const tiedProposalIds = Object.entries(voteCounts)
    .filter(([, count]) => count === highestCount)
    .map(([proposalId]) => proposalId);

  if (tiedProposalIds.length === 1) {
    return tiedProposalIds[0];
  }

  const rng = createPrng(`${gameWeek.id}:tie-break`);
  return tiedProposalIds[Math.floor(rng() * tiedProposalIds.length)] ?? gameWeek.proposals[0].id;
}

function pickWeightedProposal(weightedProposals, rng) {
  const totalWeight = weightedProposals.reduce((sum, entry) => sum + entry.weight, 0);
  let cursor = rng() * totalWeight;

  for (const proposal of weightedProposals) {
    cursor -= proposal.weight;

    if (cursor <= 0) {
      return proposal.proposalId;
    }
  }

  return weightedProposals[weightedProposals.length - 1]?.proposalId ?? "neutral";
}

function findProposal(gameWeek, proposalId) {
  return (
    gameWeek.proposals.find((proposal) => proposal.id === proposalId) ??
    gameWeek.proposals[0]
  );
}

function getClubStrength(teamName) {
  const normalized = normalizeClubName(teamName);
  return CLUB_STRENGTHS[normalized] ?? 74;
}

function isHomeTeamSelection(selectionTeam, homeTeam) {
  return normalizeClubName(selectionTeam) === normalizeClubName(homeTeam);
}

function normalizeClubName(name) {
  const normalized = name
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/football club|fc|afc/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

  return CLUB_ALIASES[normalized] ?? normalized;
}

function createPrng(seedInput) {
  let seed = hashString(seedInput) || 1;

  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function hashString(value) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function roundCurrency(value) {
  return Math.round(value * 100) / 100;
}

function addHours(value, hours) {
  return new Date(value.getTime() + hours * 60 * 60 * 1000);
}

function addMinutes(value, minutes) {
  return new Date(value.getTime() + minutes * 60 * 1000);
}

function buildJoinedOnDateIso(joinedOn) {
  const [year, month, day] = joinedOn.split("-").map(Number);
  return new Date(year, month - 1, day, 9, 0, 0, 0).toISOString();
}

function formatMatchdayLabel(gameWeekId) {
  const matchNumber = gameWeekId.match(/\d+/)?.[0] ?? gameWeekId;
  return `Matchday ${matchNumber}`;
}

function formatSettlementLabel(settlementKind) {
  return settlementKind === "cashout" ? "Cashout" : "Settled";
}

function formatProposalTitle(proposalId) {
  return proposalId.charAt(0).toUpperCase() + proposalId.slice(1);
}

function renderLeagueData(record) {
  return `${[
    "export type LeagueSimulationSlipRecord = {",
    '  proposalId: string;',
    '  timelineLabel: string;',
    '  stake: number;',
    '  stakePlacedAt: string;',
    '  settledAt: string;',
    '  settlementKind: "settled" | "cashout";',
    '  returnAmount: number;',
    '  status: "win" | "loss";',
    "};",
    "",
    "export type LeagueMatchdaySimulationRecord = {",
    "  gameWeekId: string;",
    "  voteResolvedAtIso: string;",
    "  betPlacedAtIso: string;",
    "  selectedProposalId: string;",
    "  votesByUserId: Record<string, string>;",
    "  betLineOddsByLabel: Record<string, string>;",
    "  simulatedSlip: LeagueSimulationSlipRecord;",
    "};",
    "",
    "export type LeagueDataRecord = {",
    "  simulatedAtIso: string;",
    "  updatedAtIso: string;",
    "  matchdaySimulations: LeagueMatchdaySimulationRecord[];",
    "};",
    "",
    `export const leagueData: LeagueDataRecord = ${JSON.stringify(record, null, 2)};`,
    "",
  ].join("\n")}`;
}

function renderLedgerData(records) {
  return `${[
    'export type LedgerTransactionKind = "deposit" | "stake" | "settlement";',
    "",
    "export type LedgerTransactionRecord = {",
    "  id: string;",
    "  title: string;",
    "  dateIso: string;",
    "  amount: number;",
    "  kind: LedgerTransactionKind;",
    "  gameWeekId?: string;",
    "  proposalId?: string;",
    "};",
    "",
    `export const ledgerData: LedgerTransactionRecord[] = ${JSON.stringify(records, null, 2)};`,
    "",
  ].join("\n")}`;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
