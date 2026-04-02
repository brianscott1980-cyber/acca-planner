import path from "node:path";
import { fileURLToPath } from "node:url";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import ts from "typescript";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..", "..");
const LONDON_TIME_ZONE = "Europe/London";

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

const MONTH_INDEX_BY_LABEL = {
  jan: 0,
  feb: 1,
  mar: 2,
  apr: 3,
  may: 4,
  jun: 5,
  jul: 6,
  aug: 7,
  sep: 8,
  oct: 9,
  nov: 10,
  dec: 11,
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
  const [{ users }, { matchdaySchedule }, { marketAnalysisSnapshots }] = await Promise.all([
    loadTsModule("data/users.ts"),
    loadTsModule("data/matchday_schedule.ts"),
    loadTsModule("data/market_analysis.ts"),
  ]);
  const matchdaySimulations = buildMatchdaySimulations({
    users,
    gameWeeks: matchdaySchedule,
    ladbrokesOddsSnapshots: marketAnalysisSnapshots,
    simulatedAt,
  });
  const ledgerTransactions = buildLedgerTransactions({
    users,
    matchdaySimulations,
    simulatedAt,
  });

  await mkdir(path.join(ROOT, "data"), { recursive: true });
  await writeFile(
    path.join(ROOT, "data", "league_data_meta.ts"),
    renderLeagueDataMeta({
      simulatedAtIso: simulatedAt.toISOString(),
      updatedAtIso: updatedAt.toISOString(),
    }),
  );
  await writeFile(
    path.join(ROOT, "data", "league_data_matchday_simulations.ts"),
    renderLeagueDataMatchdaySimulations(matchdaySimulations),
  );
  await writeFile(
    path.join(ROOT, "data", "league_data_votes.ts"),
    renderLeagueDataVotes(matchdaySimulations),
  );
  await writeFile(
    path.join(ROOT, "data", "league_data_bet_line_odds.ts"),
    renderLeagueDataBetLineOdds(matchdaySimulations),
  );
  await writeFile(
    path.join(ROOT, "data", "league_data_slips.ts"),
    renderLeagueDataSlips(matchdaySimulations),
  );
  await writeFile(
    path.join(ROOT, "data", "league_data_leg_results.ts"),
    renderLeagueDataLegResults(matchdaySimulations),
  );
  await writeFile(
    path.join(ROOT, "data", "ledger_data.ts"),
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
  const parsedDate = createDateInLondonTime({
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hours: Number(hours),
    minutes: Number(minutes),
  });

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

function buildMatchdaySimulations({
  users,
  gameWeeks,
  ladbrokesOddsSnapshots,
  simulatedAt,
}) {
  const includedGameWeeks = getIncludedGameWeeks(gameWeeks, simulatedAt);
  const sortedGameWeeks = [...includedGameWeeks].sort(
    (left, right) =>
      new Date(left.windowStartIso).getTime() -
      new Date(right.windowStartIso).getTime(),
  );
  const initialPotTotal = users.length * 10;
  let runningPot = initialPotTotal;
  let completedGameWeeks = 0;

  return sortedGameWeeks.map((gameWeek) => {
    const windowStartDateParts = getLondonDateParts(new Date(gameWeek.windowStartIso));
    const voteResolvedAt = createDateInLondonTime({
      year: windowStartDateParts.year,
      month: windowStartDateParts.month,
      day: windowStartDateParts.day - 1,
      hours: 0,
      minutes: 0,
      seconds: 0,
    });
    const betPlacedAt = addHours(new Date(gameWeek.windowStartIso), -18);
    const betLineOddsByLabel = buildBetLineOddsByLabel(
      gameWeek,
      ladbrokesOddsSnapshots,
    );
    const initialVotesByUserId = buildVotesByUserId({
      users,
      gameWeek,
      betLineOddsByLabel,
    });
    const selectedProposalId = getWinningProposalId({
      gameWeek,
      votesByUserId: initialVotesByUserId,
    });
    const votesByUserId = ensureWinningProposalMajority({
      gameWeekId: gameWeek.id,
      users,
      votesByUserId: initialVotesByUserId,
      winningProposalId: selectedProposalId,
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
      betLineOddsByLabel,
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

function getIncludedGameWeeks(gameWeeks, simulatedAt) {
  const sortedGameWeeks = [...gameWeeks].sort(
    (left, right) =>
      new Date(left.windowStartIso).getTime() -
      new Date(right.windowStartIso).getTime(),
  );
  const simulatedTime = simulatedAt.getTime();
  const startedOrClosedGameWeeks = sortedGameWeeks.filter(
    (gameWeek) => new Date(gameWeek.windowStartIso).getTime() <= simulatedTime,
  );

  if (startedOrClosedGameWeeks.length > 0) {
    const nextUpcomingIndex = sortedGameWeeks.findIndex(
      (gameWeek) => new Date(gameWeek.windowStartIso).getTime() > simulatedTime,
    );
    const nextUpcomingGameWeek =
      nextUpcomingIndex === -1 ? null : sortedGameWeeks[nextUpcomingIndex];
    const previousGameWeek =
      nextUpcomingIndex <= 0 ? null : sortedGameWeeks[nextUpcomingIndex - 1];

    return nextUpcomingGameWeek &&
      isNextGameWeekAvailable(previousGameWeek, simulatedAt)
      ? [...startedOrClosedGameWeeks, nextUpcomingGameWeek]
      : startedOrClosedGameWeeks;
  }

  return sortedGameWeeks.length > 0 ? [sortedGameWeeks[0]] : [];
}

function isNextGameWeekAvailable(previousGameWeek, simulatedAt) {
  if (!previousGameWeek) {
    return true;
  }

  const previousWindowEnd = getLondonDateParts(
    new Date(previousGameWeek.windowEndIso),
  );
  const releaseDate = createDateInLondonTime({
    year: previousWindowEnd.year,
    month: previousWindowEnd.month,
    day: previousWindowEnd.day + 1,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  return simulatedAt.getTime() >= releaseDate.getTime();
}

function createDateInLondonTime({
  year,
  month,
  day,
  hours = 0,
  minutes = 0,
  seconds = 0,
}) {
  const utcGuess = Date.UTC(year, month - 1, day, hours, minutes, seconds);
  let resolvedTime = utcGuess;

  for (let index = 0; index < 2; index += 1) {
    const offsetMinutes = getLondonOffsetMinutes(new Date(resolvedTime));
    resolvedTime =
      Date.UTC(year, month - 1, day, hours, minutes, seconds) -
      offsetMinutes * 60 * 1000;
  }

  return new Date(resolvedTime);
}

function getLondonOffsetMinutes(date) {
  const timeZoneName = new Intl.DateTimeFormat("en-GB", {
    timeZone: LONDON_TIME_ZONE,
    timeZoneName: "shortOffset",
  })
    .formatToParts(date)
    .find((part) => part.type === "timeZoneName")?.value;

  if (!timeZoneName || timeZoneName === "GMT") {
    return 0;
  }

  const match = timeZoneName.match(/^GMT([+-])(\d{1,2})(?::?(\d{2}))?$/);

  if (!match) {
    return 0;
  }

  const [, sign, hours = "0", minutes = "0"] = match;
  const offsetMinutes = Number(hours) * 60 + Number(minutes);

  return sign === "-" ? -offsetMinutes : offsetMinutes;
}

function getLondonDateParts(date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: LONDON_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

  const getPart = (type) => Number(parts.find((part) => part.type === type)?.value);

  return {
    year: getPart("year"),
    month: getPart("month"),
    day: getPart("day"),
    hours: getPart("hour"),
    minutes: getPart("minute"),
    seconds: getPart("second"),
  };
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

function ensureWinningProposalMajority({
  gameWeekId,
  users,
  votesByUserId,
  winningProposalId,
}) {
  const requiredVotes = Math.floor(users.length / 2) + 1;
  const currentVotes = Object.values(votesByUserId).filter(
    (proposalId) => proposalId === winningProposalId,
  ).length;

  if (currentVotes >= requiredVotes) {
    return votesByUserId;
  }

  const updatedVotesByUserId = { ...votesByUserId };
  const votersToFlip = users
    .map((user) => user.id)
    .filter((userId) => updatedVotesByUserId[userId] !== winningProposalId)
    .sort((leftUserId, rightUserId) =>
      hashString(`${gameWeekId}:${leftUserId}:consensus-adjustment`) -
      hashString(`${gameWeekId}:${rightUserId}:consensus-adjustment`),
    );

  const votesNeeded = requiredVotes - currentVotes;

  for (const userId of votersToFlip.slice(0, votesNeeded)) {
    updatedVotesByUserId[userId] = winningProposalId;
  }

  return updatedVotesByUserId;
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
  const probability = getBetLineProbability(label);
  return clamp(roundCurrency((1 / clamp(probability, 0.08, 0.92)) * 1.06), 1.12, 8.5);
}

function getBetLineProbability(label) {
  const { homeTeam, awayTeam, marketLabel } = parseBetLineLabel(label);
  const homeStrength = getClubStrength(homeTeam);
  const awayStrength = getClubStrength(awayTeam);
  const {
    homeWinProb,
    drawProb,
    awayWinProb,
    over15Prob,
    over25Prob,
    bttsProb,
    awayScoreProb,
  } = getFixtureProbabilities(homeStrength, awayStrength);
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
  } else if (/under 2\.5 goals/i.test(marketLabel)) {
    probability = 1 - over25Prob;
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
  } else if (/or draw/i.test(marketLabel)) {
    const team = marketLabel.replace(/or draw/i, "").trim();
    probability = isHomeTeamSelection(team, homeTeam)
      ? homeWinProb + drawProb
      : awayWinProb + drawProb;
  } else if (/to win/i.test(marketLabel)) {
    const team = marketLabel.replace(/to win/i, "").trim();
    probability = isHomeTeamSelection(team, homeTeam)
      ? homeWinProb
      : awayWinProb;
  }

  return probability;
}

function parseBetLineLabel(label) {
  const [fixtureLabel, marketLabel = ""] = label.split(":").map((part) => part.trim());
  const [homeTeam = "", awayTeam = ""] = fixtureLabel
    .split(/\s+v(?:s)?\s+/i)
    .map((team) => team.trim());

  return {
    fixtureLabel,
    marketLabel,
    homeTeam,
    awayTeam,
  };
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

function buildSimulatedSlip({
  gameWeek,
  proposal,
  proposalOdds,
  stake,
  betPlacedAt,
  betLineOddsByLabel,
}) {
  const rng = createPrng(`${gameWeek.id}:${proposal.id}:settlement`);
  const legResults = buildSimulatedLegResults({
    gameWeek,
    proposal,
    betLineOddsByLabel,
  });
  const chronologicalLegResults = [...legResults].sort(
    (left, right) =>
      new Date(left.kickoffAt).getTime() - new Date(right.kickoffAt).getTime(),
  );
  const fullReturn = roundCurrency(stake * proposalOdds);
  const firstLosingIndex = chronologicalLegResults.findIndex(
    (legResult) => legResult.actualStatus === "lost",
  );
  let settlementKind = "settled";
  let returnAmount = 0;
  let settledAt = chronologicalLegResults.at(-1)
    ? new Date(chronologicalLegResults.at(-1).settledAt)
    : addMinutes(new Date(gameWeek.windowEndIso), -5);
  const displayedStatusByLabel = new Map(
    chronologicalLegResults.map((legResult) => [
      legResult.betLineLabel,
      legResult.actualStatus,
    ]),
  );

  if (firstLosingIndex === -1) {
    const shouldTakeProfit =
      chronologicalLegResults.length > 1 &&
      rng() <
        (proposal.riskLevel === "safe"
          ? 0.34
          : proposal.riskLevel === "balanced"
            ? 0.24
            : 0.14);

    if (shouldTakeProfit) {
      const remainingLegs =
        chronologicalLegResults.length > 2 && rng() < 0.32 ? 2 : 1;
      const cashoutStartIndex = Math.max(
        1,
        chronologicalLegResults.length - remainingLegs,
      );
      settlementKind = "cashout";
      settledAt = getCashoutTimestamp(chronologicalLegResults, cashoutStartIndex);
      returnAmount = calculateCashoutReturn({
        stake,
        fullReturn,
        chronologicalLegResults,
        cashoutStartIndex,
        proposal,
        protectingAgainstKnownLoss: false,
        rng,
      });

      for (let index = cashoutStartIndex; index < chronologicalLegResults.length; index += 1) {
        displayedStatusByLabel.set(
          chronologicalLegResults[index].betLineLabel,
          "cashed_out",
        );
      }
    } else {
      returnAmount = fullReturn;
    }
  } else {
    const canCashoutBeforeLosingLeg = firstLosingIndex > 0;
    const shouldCashoutBeforeLosingLeg =
      canCashoutBeforeLosingLeg &&
      rng() <
        clamp(
          (proposal.riskLevel === "safe"
            ? 0.76
            : proposal.riskLevel === "balanced"
              ? 0.58
              : 0.34) +
            Math.min(firstLosingIndex, 3) * 0.04,
          0.18,
          0.88,
        );

    if (shouldCashoutBeforeLosingLeg) {
      settlementKind = "cashout";
      settledAt = getCashoutTimestamp(chronologicalLegResults, firstLosingIndex);
      returnAmount = calculateCashoutReturn({
        stake,
        fullReturn,
        chronologicalLegResults,
        cashoutStartIndex: firstLosingIndex,
        proposal,
        protectingAgainstKnownLoss: true,
        rng,
      });

      for (let index = firstLosingIndex; index < chronologicalLegResults.length; index += 1) {
        displayedStatusByLabel.set(
          chronologicalLegResults[index].betLineLabel,
          "cashed_out",
        );
      }
    } else {
      settledAt = new Date(chronologicalLegResults[firstLosingIndex].settledAt);
    }
  }

  const finalLegResults = legResults.map((legResult) => ({
    betLineLabel: legResult.betLineLabel,
    kickoffAt: legResult.kickoffAt,
    settledAt: legResult.settledAt,
    finalScore: legResult.finalScore,
    status: displayedStatusByLabel.get(legResult.betLineLabel) ?? legResult.actualStatus,
    actualStatus: legResult.actualStatus,
  }));
  const status = returnAmount >= stake ? "win" : "loss";

  return {
    proposalId: proposal.id,
    timelineLabel: `${proposal.title} Strategy`,
    stake,
    stakePlacedAt: betPlacedAt.toISOString(),
    settledAt: settledAt.toISOString(),
    settlementKind,
    returnAmount,
    status,
    legResults: finalLegResults,
  };
}

function buildSimulatedLegResults({ gameWeek, proposal, betLineOddsByLabel }) {
  const fixtureSimulationsByLabel = new Map();

  return proposal.betLines.map((betLine, index) => {
    const parsedBetLine = parseBetLineLabel(betLine.label);
    const fixtureSimulation =
      fixtureSimulationsByLabel.get(parsedBetLine.fixtureLabel) ??
      buildFixtureSimulation({
        gameWeek,
        fixtureLabel: parsedBetLine.fixtureLabel,
        homeTeam: parsedBetLine.homeTeam,
        awayTeam: parsedBetLine.awayTeam,
        scheduleNote: betLine.scheduleNote,
        fallbackIndex: index,
        fallbackTotal: proposal.betLines.length,
      });

    fixtureSimulationsByLabel.set(parsedBetLine.fixtureLabel, fixtureSimulation);

    const actualStatus = evaluateBetLineOutcome({
      parsedBetLine,
      fixtureSimulation,
      fallbackProbability: getFairProbabilityFromOdds(
        Number.parseFloat(
          betLineOddsByLabel[betLine.label] ?? betLine.odds ?? "1",
        ),
      ),
      fallbackSeed: `${gameWeek.id}:${betLine.label}:fallback`,
    });

    const decimalOdds = Number.parseFloat(
      betLineOddsByLabel[betLine.label] ?? betLine.odds ?? "1",
    );

    return {
      betLineLabel: betLine.label,
      kickoffAt: fixtureSimulation.kickoffAt.toISOString(),
      settledAt: fixtureSimulation.settledAt.toISOString(),
      finalScore: formatFixtureScore(
        parsedBetLine.homeTeam,
        parsedBetLine.awayTeam,
        fixtureSimulation.homeGoals,
        fixtureSimulation.awayGoals,
      ),
      decimalOdds,
      status: actualStatus,
      actualStatus,
    };
  });
}

function buildFixtureSimulation({
  gameWeek,
  fixtureLabel,
  homeTeam,
  awayTeam,
  scheduleNote,
  fallbackIndex,
  fallbackTotal,
}) {
  const kickoffAt =
    parseScheduleNoteDate(scheduleNote, gameWeek) ??
    getFallbackKickoffAt(gameWeek, fallbackIndex, fallbackTotal);
  const rng = createPrng(`${gameWeek.id}:${fixtureLabel}:score`);
  const homeStrength = getClubStrength(homeTeam);
  const awayStrength = getClubStrength(awayTeam);
  const { homeExpectedGoals, awayExpectedGoals } = getExpectedGoals(
    homeStrength,
    awayStrength,
  );

  return {
    kickoffAt,
    settledAt: addMinutes(kickoffAt, 108 + Math.floor(rng() * 17)),
    homeGoals: samplePoisson(homeExpectedGoals, rng),
    awayGoals: samplePoisson(awayExpectedGoals, rng),
  };
}

function evaluateBetLineOutcome({
  parsedBetLine,
  fixtureSimulation,
  fallbackProbability,
  fallbackSeed,
}) {
  const { marketLabel, homeTeam, awayTeam } = parsedBetLine;
  const { homeGoals, awayGoals } = fixtureSimulation;
  const totalGoals = homeGoals + awayGoals;
  const draw = homeGoals === awayGoals;
  const homeWon = homeGoals > awayGoals;
  const awayWon = awayGoals > homeGoals;
  const bothTeamsScored = homeGoals > 0 && awayGoals > 0;

  if (/draw no bet/i.test(marketLabel)) {
    const team = marketLabel.replace(/draw no bet/i, "").trim();
    return isHomeTeamSelection(team, homeTeam)
      ? homeWon
        ? "won"
        : "lost"
      : awayWon
        ? "won"
        : "lost";
  }

  if (/both teams to score\s*&\s*over 2\.5 goals/i.test(marketLabel)) {
    return bothTeamsScored && totalGoals > 2.5 ? "won" : "lost";
  }

  if (/to win\s*&\s*both teams to score/i.test(marketLabel)) {
    const team = marketLabel.replace(/to win\s*&\s*both teams to score/i, "").trim();
    const teamWon = isHomeTeamSelection(team, homeTeam) ? homeWon : awayWon;
    return teamWon && bothTeamsScored ? "won" : "lost";
  }

  if (/to win\s*&\s*over 2\.5 goals/i.test(marketLabel)) {
    const team = marketLabel.replace(/to win\s*&\s*over 2\.5 goals/i, "").trim();
    const teamWon = isHomeTeamSelection(team, homeTeam) ? homeWon : awayWon;
    return teamWon && totalGoals > 2.5 ? "won" : "lost";
  }

  if (/both teams to score/i.test(marketLabel)) {
    return bothTeamsScored ? "won" : "lost";
  }

  const overMatch = marketLabel.match(/over\s+(\d+(?:\.\d+)?)\s+goals?/i);
  if (overMatch) {
    return totalGoals > Number.parseFloat(overMatch[1]) ? "won" : "lost";
  }

  const underMatch = marketLabel.match(/under\s+(\d+(?:\.\d+)?)\s+goals?/i);
  if (underMatch) {
    return totalGoals < Number.parseFloat(underMatch[1]) ? "won" : "lost";
  }

  if (/win to nil/i.test(marketLabel)) {
    const team = marketLabel.replace(/win to nil/i, "").trim();
    const selectedHome = isHomeTeamSelection(team, homeTeam);
    const teamWon = selectedHome ? homeWon : awayWon;
    const conceded = selectedHome ? awayGoals : homeGoals;
    return teamWon && conceded === 0 ? "won" : "lost";
  }

  if (/-1 handicap/i.test(marketLabel)) {
    const team = marketLabel.replace(/-1 handicap/i, "").trim();
    const selectedHome = isHomeTeamSelection(team, homeTeam);
    const goalDifference = selectedHome
      ? homeGoals - awayGoals
      : awayGoals - homeGoals;
    return goalDifference >= 2 ? "won" : "lost";
  }

  if (/or draw/i.test(marketLabel)) {
    const team = marketLabel.replace(/or draw/i, "").trim();
    const selectedWon = isHomeTeamSelection(team, homeTeam) ? homeWon : awayWon;
    return selectedWon || draw ? "won" : "lost";
  }

  if (/to win/i.test(marketLabel)) {
    const team = marketLabel.replace(/to win/i, "").trim();
    const selectedWon = isHomeTeamSelection(team, homeTeam) ? homeWon : awayWon;
    return selectedWon ? "won" : "lost";
  }

  const fallbackRng = createPrng(fallbackSeed);
  return fallbackRng() < fallbackProbability ? "won" : "lost";
}

function calculateCashoutReturn({
  stake,
  fullReturn,
  chronologicalLegResults,
  cashoutStartIndex,
  proposal,
  protectingAgainstKnownLoss,
  rng,
}) {
  const unresolvedLegs = chronologicalLegResults.slice(cashoutStartIndex);
  const unresolvedProbability = unresolvedLegs.reduce(
    (total, legResult) =>
      total * getFairProbabilityFromOdds(legResult.decimalOdds),
    1,
  );
  const riskDiscount =
    proposal.riskLevel === "safe"
      ? protectingAgainstKnownLoss
        ? 0.9
        : 0.86
      : proposal.riskLevel === "balanced"
        ? protectingAgainstKnownLoss
          ? 0.84
          : 0.8
        : protectingAgainstKnownLoss
          ? 0.76
          : 0.72;
  const marketValue =
    fullReturn *
    unresolvedProbability *
    riskDiscount *
    (0.96 + rng() * 0.08);
  const floorValue =
    stake *
    clamp(
      0.28 + (cashoutStartIndex / chronologicalLegResults.length) * 0.62,
      0.22,
      0.94,
    );
  const ceilingValue =
    fullReturn *
    clamp(0.88 - unresolvedLegs.length * 0.06, 0.42, 0.9);
  const lowerBound = Math.min(floorValue, ceilingValue);
  const upperBound = Math.max(floorValue, ceilingValue);

  return roundCurrency(clamp(marketValue, lowerBound, upperBound));
}

function getCashoutTimestamp(chronologicalLegResults, cashoutStartIndex) {
  const nextKickoff = new Date(chronologicalLegResults[cashoutStartIndex].kickoffAt);
  const previousSettledAt =
    cashoutStartIndex > 0
      ? new Date(chronologicalLegResults[cashoutStartIndex - 1].settledAt)
      : null;
  let cashoutAt = addMinutes(nextKickoff, -(40 + cashoutStartIndex * 5));

  if (previousSettledAt && cashoutAt.getTime() <= previousSettledAt.getTime()) {
    cashoutAt = addMinutes(previousSettledAt, 30);
  }

  return cashoutAt;
}

function getFallbackKickoffAt(gameWeek, index, total) {
  const windowStart = new Date(gameWeek.windowStartIso).getTime();
  const windowEnd = new Date(gameWeek.windowEndIso).getTime();
  const segmentSize = (windowEnd - windowStart) / Math.max(total + 1, 2);

  return new Date(windowStart + segmentSize * (index + 1));
}

function parseScheduleNoteDate(scheduleNote, gameWeek) {
  if (!scheduleNote) {
    return null;
  }

  const match = scheduleNote.match(
    /^[A-Za-z]{3}\s+(\d{1,2})\s+([A-Za-z]{3}),\s+(\d{1,2}):(\d{2})/,
  );

  if (!match) {
    return null;
  }

  const [, dayLabel, monthLabel, hourLabel, minuteLabel] = match;
  const monthIndex = MONTH_INDEX_BY_LABEL[monthLabel.toLowerCase()];

  if (monthIndex === undefined) {
    return null;
  }

  const referenceDate = new Date(gameWeek.windowStartIso);

  return new Date(
    referenceDate.getFullYear(),
    monthIndex,
    Number(dayLabel),
    Number(hourLabel),
    Number(minuteLabel),
  );
}

function getExpectedGoals(homeStrength, awayStrength) {
  const strengthDiff = homeStrength - awayStrength;

  return {
    homeExpectedGoals: clamp(
      1.32 + strengthDiff * 0.018 + (homeStrength - 74) / 80 + 0.18,
      0.45,
      3.3,
    ),
    awayExpectedGoals: clamp(
      0.98 - strengthDiff * 0.013 + (awayStrength - 74) / 85,
      0.25,
      2.7,
    ),
  };
}

function samplePoisson(lambda, rng) {
  const limit = Math.exp(-lambda);
  let goals = 0;
  let probabilityProduct = 1;

  while (probabilityProduct > limit && goals < 7) {
    goals += 1;
    probabilityProduct *= rng();
  }

  return goals - 1;
}

function formatFixtureScore(homeTeam, awayTeam, homeGoals, awayGoals) {
  return `${homeTeam} ${homeGoals}-${awayGoals} ${awayTeam}`;
}

function getFairProbabilityFromOdds(decimalOdds) {
  return clamp(1 / Math.max(decimalOdds * 1.06, 1.06), 0.08, 0.92);
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

function renderLeagueDataMeta(record) {
  return `${[
    'import type { LeagueDataMetaRecord } from "./league_data_entities";',
    "",
    `export const leagueDataMeta: LeagueDataMetaRecord[] = ${JSON.stringify(
      [{ id: "primary", ...record }],
      null,
      2,
    )};`,
    "",
  ].join("\n")}`;
}

function renderLeagueDataMatchdaySimulations(matchdaySimulations) {
  return `${[
    'import type { LeagueMatchdaySimulationRow } from "./league_data_entities";',
    "",
    `export const leagueDataMatchdaySimulations: LeagueMatchdaySimulationRow[] = ${JSON.stringify(
      matchdaySimulations.map((simulation) => ({
        id: `${simulation.gameWeekId}:simulation`,
        gameWeekId: simulation.gameWeekId,
        voteResolvedAtIso: simulation.voteResolvedAtIso,
        betPlacedAtIso: simulation.betPlacedAtIso,
        selectedProposalId: simulation.selectedProposalId,
        slipId: `${simulation.gameWeekId}:${simulation.simulatedSlip.proposalId}:slip`,
      })),
      null,
      2,
    )};`,
    "",
  ].join("\n")}`;
}

function renderLeagueDataVotes(matchdaySimulations) {
  return `${[
    'import type { LeagueMatchdayVoteRow } from "./league_data_entities";',
    "",
    `export const leagueDataVotes: LeagueMatchdayVoteRow[] = ${JSON.stringify(
      matchdaySimulations.flatMap((simulation) =>
        Object.entries(simulation.votesByUserId).map(([userId, proposalId]) => ({
          id: `${simulation.gameWeekId}:vote:${userId}`,
          simulationId: `${simulation.gameWeekId}:simulation`,
          gameWeekId: simulation.gameWeekId,
          userId,
          proposalId,
        })),
      ),
      null,
      2,
    )};`,
    "",
  ].join("\n")}`;
}

function renderLeagueDataBetLineOdds(matchdaySimulations) {
  return `${[
    'import type { LeagueMatchdayBetLineOddsRow } from "./league_data_entities";',
    "",
    `export const leagueDataBetLineOdds: LeagueMatchdayBetLineOddsRow[] = ${JSON.stringify(
      matchdaySimulations.flatMap((simulation) =>
        Object.entries(simulation.betLineOddsByLabel).map(
          ([betLineLabel, odds], index) => ({
            id: `${simulation.gameWeekId}:odds:${index + 1}`,
            simulationId: `${simulation.gameWeekId}:simulation`,
            gameWeekId: simulation.gameWeekId,
            order: index,
            betLineLabel,
            odds,
          }),
        ),
      ),
      null,
      2,
    )};`,
    "",
  ].join("\n")}`;
}

function renderLeagueDataSlips(matchdaySimulations) {
  return `${[
    'import type { LeagueSimulationSlipRow } from "./league_data_entities";',
    "",
    `export const leagueDataSlips: LeagueSimulationSlipRow[] = ${JSON.stringify(
      matchdaySimulations.map((simulation) => ({
        id: `${simulation.gameWeekId}:${simulation.simulatedSlip.proposalId}:slip`,
        simulationId: `${simulation.gameWeekId}:simulation`,
        gameWeekId: simulation.gameWeekId,
        proposalId: simulation.simulatedSlip.proposalId,
        timelineLabel: simulation.simulatedSlip.timelineLabel,
        stake: simulation.simulatedSlip.stake,
        stakePlacedAt: simulation.simulatedSlip.stakePlacedAt,
        settledAt: simulation.simulatedSlip.settledAt,
        settlementKind: simulation.simulatedSlip.settlementKind,
        returnAmount: simulation.simulatedSlip.returnAmount,
        status: simulation.simulatedSlip.status,
      })),
      null,
      2,
    )};`,
    "",
  ].join("\n")}`;
}

function renderLeagueDataLegResults(matchdaySimulations) {
  return `${[
    'import type { LeagueSimulationLegResultRow } from "./league_data_entities";',
    "",
    `export const leagueDataLegResults: LeagueSimulationLegResultRow[] = ${JSON.stringify(
      matchdaySimulations.flatMap((simulation) =>
        simulation.simulatedSlip.legResults.map((legResult, index) => ({
          id: `${simulation.gameWeekId}:${simulation.simulatedSlip.proposalId}:slip:leg:${index + 1}`,
          simulationId: `${simulation.gameWeekId}:simulation`,
          slipId: `${simulation.gameWeekId}:${simulation.simulatedSlip.proposalId}:slip`,
          gameWeekId: simulation.gameWeekId,
          order: index,
          betLineLabel: legResult.betLineLabel,
          kickoffAt: legResult.kickoffAt,
          settledAt: legResult.settledAt,
          finalScore: legResult.finalScore,
          status: legResult.status,
          actualStatus: legResult.actualStatus,
        })),
      ),
      null,
      2,
    )};`,
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
