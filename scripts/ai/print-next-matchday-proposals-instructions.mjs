#!/usr/bin/env node

const LONDON_TIME_ZONE = "Europe/London";
const LEAGUES = [
  "English Premier League",
  "SPFL",
  "Spanish La Liga",
  "German Bundesliga",
  "Italian Serie A",
  "UEFA Champions League",
  "UEFA Europa League",
];
const LOCAL_DATA_FILES = [
  "data/market_analysis_snapshots.ts",
  "data/market_analysis_selections.ts",
  "data/matchday_game_weeks.ts",
  "data/matchday_proposals.ts",
  "data/matchday_bet_lines.ts",
  "data/matchday_forms.ts",
  "data/matchday_form_matches.ts",
  "data/bet_learning_feedback.ts",
  "data/timeline_events.ts",
];

main();

function main() {
  const referenceDate = getReferenceDate(process.argv.slice(2));
  const weekendWindow = getNextWeekendWindow(referenceDate);
  const generatedAt = formatDateTime(referenceDate);

  process.stdout.write(renderInstructionBlock({ generatedAt, weekendWindow }));
}

function getReferenceDate(argumentsList) {
  const dateArgument = argumentsList.find((argument) => argument.startsWith("--date="));

  if (!dateArgument) {
    return new Date();
  }

  const rawValue = dateArgument.slice("--date=".length).trim();
  const parsedDate = new Date(rawValue);

  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(
      `Invalid --date value "${rawValue}". Use an ISO date such as 2026-04-03 or a full ISO timestamp.`,
    );
  }

  return parsedDate;
}

function getNextWeekendWindow(referenceDate) {
  const londonParts = getLondonDateParts(referenceDate);
  const referenceDay = createUtcDateFromParts(
    londonParts.year,
    londonParts.month,
    londonParts.day,
  );
  const dayOffset = getDaysUntilNextSaturday(londonParts);
  const saturdayDate = addUtcDays(referenceDay, dayOffset);
  const mondayDate = addUtcDays(saturdayDate, 2);

  return {
    saturdayDate,
    mondayDate,
    startLabel: `${formatLongDate(saturdayDate)} 09:00 ${LONDON_TIME_ZONE}`,
    endLabel: `${formatLongDate(mondayDate)} 23:00 ${LONDON_TIME_ZONE}`,
    snapshotDate: formatIsoDate(saturdayDate),
  };
}

function getLondonDateParts(date) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: LONDON_TIME_ZONE,
    weekday: "long",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  });
  const parts = formatter.formatToParts(date);

  return {
    weekday: getPartValue(parts, "weekday"),
    year: Number.parseInt(getPartValue(parts, "year"), 10),
    month: Number.parseInt(getPartValue(parts, "month"), 10),
    day: Number.parseInt(getPartValue(parts, "day"), 10),
    hour: Number.parseInt(getPartValue(parts, "hour"), 10),
    minute: Number.parseInt(getPartValue(parts, "minute"), 10),
  };
}

function getPartValue(parts, type) {
  return parts.find((part) => part.type === type)?.value ?? "";
}

function getDaysUntilNextSaturday(parts) {
  const weekdayIndex = getWeekdayIndex(parts.weekday);
  const saturdayIndex = 6;
  const currentMinutes = parts.hour * 60 + parts.minute;
  const saturdayStartMinutes = 9 * 60;
  const daysUntilSaturday = (saturdayIndex - weekdayIndex + 7) % 7;

  if (daysUntilSaturday > 0) {
    return daysUntilSaturday;
  }

  return currentMinutes < saturdayStartMinutes ? 0 : 7;
}

function getWeekdayIndex(weekday) {
  const weekdayIndexes = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6,
  };

  return weekdayIndexes[weekday] ?? 0;
}

function createUtcDateFromParts(year, month, day) {
  return new Date(Date.UTC(year, month - 1, day));
}

function addUtcDays(date, days) {
  const next = new Date(date.getTime());
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function formatLongDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: LONDON_TIME_ZONE,
    hour12: false,
  }).format(date);
}

function formatIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

function renderInstructionBlock({ generatedAt, weekendWindow }) {
  const filesBlock = LOCAL_DATA_FILES.map((filePath) => `- ${filePath}`).join("\n");
  const leaguesBlock = LEAGUES.map((league) => `- ${league}`).join("\n");

  return `Repeatable instruction generated ${generatedAt} (${LONDON_TIME_ZONE})

Use this as the full operating brief for the LLM. The target weekend window is:
- Start: ${weekendWindow.startLabel}
- End: ${weekendWindow.endLabel}
- Snapshot date for Ladbrokes market rows: ${weekendWindow.snapshotDate}

Instruction for the LLM:

You are updating the local mock data in the acca-planner repository.

Goal:
- Generate the next matchday proposals for the next weekend window only.
- Use AI judgement to analyse Ladbrokes prices and construct the three accumulator strategies.
- Update local repository data files only.
- Add a local timeline marker event titled "Matchday AI Analysis Ready".

Allowed competitions:
${leaguesBlock}

Interpretation rules:
- The weekend window is the next Saturday 09:00 through Monday 23:00 in ${LONDON_TIME_ZONE}.
- Include only fixtures whose kick-off falls inside that window.
- Use Ladbrokes odds information only.
- Exclude competitions, fixtures, and markets outside that scope.
- Always validate fixture status against live schedule sources before finalising selections.
- Never include fixtures that have already kicked off, finished, been postponed, or been cancelled.
- If a fixture has already been played (for example Inter v Roma already completed), it is ineligible and must be replaced.
- Treat cached or stale fixture/odds data as invalid for generation. Re-check live fixture list and live odds immediately before writing files.
- If live odds are unavailable for a candidate leg at generation time, do not use that leg.
- Use the generation-time clock as the authority for what is "upcoming". Include the concrete generation timestamp in reasoning where date sensitivity matters.
- Do not write to Supabase, do not run remote sync scripts, and do not update remote tables.
- When evaluating possible legs, do not rely on prices and recent scores alone. Also check the latest credible context that could positively or negatively affect likely team performance, including team news, club news, manager news, injuries, suspensions, expected absences, rotation risk, tactical changes, fixture congestion, and any other material signal around the team.
- For every club appearing in generated matchday legs, verify that a usable local badge asset exists in the repo mapping used by the UI.
- If a required club badge is missing, download a credible badge asset and update local data/mappings so the badge renders for that club.
- Badge completeness is mandatory for generated matchdays; do not finish with unresolved missing club badges for included fixtures.

Evidence and sentiment rules:
- Evidence standard: use at least 10 unique internet reference sources before finalising matchday proposals.
- Source quality standard:
  - Prioritise official and primary sources first (competition/league organisers, official club channels, official fixture/schedule pages, official bookmaker market pages).
  - Then use established sports media and data providers.
  - Do not rely on aggregator-only, forum-only, or low-credibility pages as primary justification.
- Public sentiment standard:
  - In addition to trusted sports sources, check recent Reddit and social-media discussion for public sentiment hints around likely match outcomes.
  - Treat social sentiment as a secondary signal only; never let it override stronger official/statistical evidence.
  - Prefer recent, fixture-specific threads and discussions over generic season chatter.
- Keep a concise source log in proposal reasoning (or summary where reasoning is surfaced) listing at least 10 sources that materially informed selections and recommendation.
- If fewer than 10 credible sources are available, do not guess; explicitly state the evidence gap in proposal reasoning and downgrade confidence.
- Include a short "Evidence confidence" statement and a short "Public sentiment check" statement in the proposal reasoning for the aiRecommended option.

Files you may update:
${filesBlock}

Do not update these files for this task:
- Any file under scripts/supabase/
- Any remote-only repository code
- data/league_data_matchday_simulations.ts
- data/league_data_votes.ts
- data/league_data_bet_line_odds.ts
- data/league_data_slips.ts
- data/league_data_leg_results.ts

Required repo contract:
- Determine the next matchday number as max existing matchday number + 1 from data/matchday_game_weeks.ts. If no matchdays exist, start at 1.
- Use a deterministic game week id of md-<number>.
- Name the game week "Matchday <number> Voting Stage".
- Set the game week window to the weekend window above.
- Replace or regenerate only the rows for that next matchday id. Do not duplicate rows if the script is rerun.
- Update market_analysis_snapshots.ts with one Ladbrokes snapshot row for the next matchday.
- Update market_analysis_selections.ts with the Ladbrokes market rows referenced by the generated bet lines.
- Update matchday_proposals.ts with exactly three proposals: safe, balanced, aggressive.
- Each proposal row should include match-specific cashout watch items when credible, so the UI can show exact in-play warnings instead of generic fallback advice.
- Update matchday_bet_lines.ts so every proposal references ordered bet lines for its chosen markets.
- Update matchday_forms.ts and matchday_form_matches.ts only if you have enough concrete recent-form evidence to populate them credibly; otherwise leave form rows absent and rely on formNote text instead.
- When form rows are provided, they must support the UI's visual five-circle row: one circle per recent match, circle background driven by win/draw/loss, and the text inside each circle set to that team's goals scored in that match.
- Update timeline_events.ts with one timeline marker row titled "Matchday AI Analysis Ready" dated at generation time for the next matchday id.
- Do not edit ledger_data.ts for proposal-generation messages. Ledger data must preserve the opening seven player deposits and any real bankroll transactions.
- Before deciding which proposal is AI recommended, inspect the existing bankroll context in the repo:
  - use ledger_data.ts to understand the current pot against the original deposit baseline
  - use completed matchday outcomes, settlement history, and recent bankroll movement to judge whether recent betting form is strong, mixed, or deteriorating
  - use bet_learning_feedback.ts to identify recurring mistakes, overconfident assumptions, and patterns that have recently underperformed or outperformed
  - use that broader context as part of the recommendation decision rather than looking at the weekend slate in isolation

Proposal construction rules:
- Generate exactly three proposals with proposal ids safe, balanced, and aggressive.
- Each proposal may contain between 2 and 5 legs.
- Choose the leg count for each proposal from the available Ladbrokes odds in the target weekend window so the final slip best matches its intended risk profile.
- Build a competition spread across the three proposals. Do not concentrate all legs in a single competition when credible options exist in other allowed competitions.
- Target at least 3 distinct competitions represented across the combined safe, balanced, and aggressive proposals.
- The safe and balanced proposals should usually include at least 2 different competitions each unless fixture availability makes that impossible.
- If the generated weekend genuinely lacks usable cross-competition options, explicitly state that constraint in summary/aiReasoning text instead of silently concentrating the card.
- The safe proposal must have the lowest combined decimal odds of the three.
- The balanced proposal must sit clearly between the safe and aggressive proposals on total odds and volatility.
- The aggressive proposal must have the highest combined decimal odds and the highest upside.
- Exactly one proposal may be marked aiRecommended: true.
- Choose the recommendation from both market fit and bankroll situation:
  - if recent results are strong and the pot is healthy or growing, the recommendation may lean more aggressive when the odds structure justifies it
- if recent results are mixed or the pot is roughly stable, the recommendation should usually stay balanced unless the slate strongly points elsewhere
- if the pot is dwindling or recent betting results have been poor, the recommendation should become more protective and prefer the safer profile unless there is a compelling reason not to
- Do not recommend a proposal blindly from odds alone. Explain why the selected recommendation fits both the current match slate and the recent bankroll trend.
- Leg choice and recommendation logic should also reflect whether current team news, club news, manager news, tactical changes, or availability concerns materially increase or reduce confidence in those selections.
- Avoid repeating recently failed patterns recorded in bet_learning_feedback.ts unless current evidence clearly and explicitly supports a different conclusion.
- Status labels must be concise and readable in the UI.
- Titles must align with the app language, for example "Defensive Accumulator", "Balanced Accumulator", and "Aggressive Accumulator".

Risk and sequencing rules:
- Sequence the legs in kickoff order using the scheduleNote format expected by the app, matching this shape: "Sat 12 Apr, 15:00 BST".
- Respect cashout sequencing. Earlier legs should generally stabilise the slip, while later legs should carry more of the payout swing.
- Safe:
  - usually fewer legs unless the available short prices require another stabilising selection
  - shortest combined odds
  - strongest favourites and lower-volatility selections
  - preserve cashout optionality after early legs land
- Balanced:
  - typically lands in the middle on both leg count and price
  - medium combined odds
  - mix of strong favourites and a limited number of price-enhancing legs
  - one or two more volatile legs can appear later in the sequence
- Aggressive:
  - can use more legs when that is the best route to the highest credible upside
  - longest combined odds
  - highest variance profile
  - later legs should carry the largest upside and the largest cashout swing

Cashout guidance rules:
- Every proposal must include cashout guidance that is genuinely specific to that proposal's legs and sequence.
- Cashout guidance must not be generic boilerplate reused across all three proposals.
- For each proposal, check the latest credible team and club context for any clubs used in its legs, including team news, club news, manager news, injuries, suspensions, likely absences, rotation risk, tactical changes, and major availability changes.
- Use that team-news context to shape the "what to watch" advice and explain what matters most for that exact strategy during live play.
- The "what to watch" advice should mention the main in-play patterns that affect cashout relevance for that proposal, such as:
  - whether an early goal improves or weakens the intended slip path
  - whether a slow opening period should make the user more cautious
  - whether missing attackers or defenders materially changes the expected match script
  - whether the proposal depends more on control, clean-sheet security, or open-game goal volume
- The "what to watch" advice should also include concrete match-level triggers that could change the cashout decision quickly, such as:
  - an upset brewing in one of the shorter-priced legs
  - a key player in a proposed leg being substituted, injured, or unexpectedly benched
  - a tactical shift that weakens the original market angle
  - visible loss of territory, shots, or control from the side the bet depends on
  - an in-play pattern that especially hurts a goals leg, such as a defensive lockdown after an early lead
- Defensive proposals should usually have more protective and earlier-warning cashout advice.
- Balanced proposals should explain the trade-off between protecting a decent return and letting the strategy's remaining edge play out.
- Aggressive proposals should still prioritise upside, but they must identify the key negative team-news or in-play signals that would justify taking a cashout instead of letting the full variance ride.
- Persist the proposal-level cashout watch items directly in matchday_proposals.ts when the repo shape supports it.

Selection quality rules:
- Consider goals-based Ladbrokes markets and match-outcome markets equally when building proposed legs.
- Goals-based options such as over-goals lines and both-teams-to-score should be weighed alongside standard match-outcome prices based on value, fit, and risk profile.
- Do not use exact-score, correct-score, winning-margin, or other highly specific result markets.
- Avoid obviously contradictory combinations across the three proposals.
- Do not stuff every proposal with the same legs unless the price structure makes that unavoidable.
- Treat meaningful team, club, and manager developments as part of the selection screen. If credible news materially weakens confidence in a leg, prefer a different market or fixture rather than ignoring it.
- Summaries and aiReasoning text should explain why the market fits the slip profile, not just restate the selection.
- Keep proposal summaries concise but specific about price, sequencing, and weekend context.
- For the single aiRecommended proposal, the summary or aiReasoning should also make clear why that option suits the current pot level and the recent betting trend.

Recent-form evidence rules:
- For every fixture used in a proposed leg, look up the last 5 matches for both teams before finalising the selection.
- Apply the same recent-form and team-context checks to UEFA Champions League and UEFA Europa League fixtures as domestic-league fixtures.
- Capture the goal count for each team across those previous 5 matches, and use that evidence when deciding whether an over-goals or both-teams-to-score market is justified.
- Reflect the last-5 scoring evidence in aiReasoning, summary text, and formNote content rather than making unsupported claims.
- Update matchday_forms.ts and matchday_form_matches.ts when you have enough concrete last-5 evidence to do so accurately. Populate exactly 5 matches per team side when you do this. If the evidence cannot be verified cleanly, do not invent form data.
- For each stored form match row, set outcome to W, D, or L for the circle background and set goalsScored to the number that should appear inside the circle.

Local timeline marker rule:
- Append a timeline_events row with:
  - a unique id tied to the matchday, such as timeline-md-<number>-proposal-generated
  - title: "Matchday AI Analysis Ready"
  - description: a four-line summary in this exact style using the final combined decimal odds for the three strategies, formatted to 2 decimal places, followed by the recommended option:
    Defensive: <safe total odds>
    Balanced: <balanced total odds>
    Aggressive: <aggressive total odds>
    AI recommended: <Defensive|Balanced|Aggressive>
  - timestampIso: current generation timestamp
  - kind: "matchday_proposal_generated"
  - matchdayId: the next matchday id
- This marker is for the timeline feed only and must not be stored as a ledger transaction.

Validation checklist before finishing:
- Exactly one next-matchday row exists in matchday_game_weeks.ts for the generated weekend.
- Exactly three proposal rows exist for that matchday.
- Every proposal has between 2 and 5 bet lines, chosen to fit its risk profile.
- Every proposal betLineId points to a bet line row for that same matchday.
- Every marketId used by a bet line exists in market_analysis_selections.ts and belongs to the snapshot row for this matchday.
- Safe total odds < balanced total odds < aggressive total odds.
- The three proposals together represent at least 3 distinct competitions when credible fixtures are available.
- The aiRecommended choice is justified by both the current market slate and the current bankroll / recent-results context.
- Cashout guidance is meaningfully differentiated across safe, balanced, and aggressive and references relevant team-news or in-play patterns for that proposal.
- Proposal reasoning includes a concise source log with at least 10 credible references and explicitly records evidence confidence plus public-sentiment alignment for the aiRecommended option.
- No generated fixture falls outside ${weekendWindow.startLabel} to ${weekendWindow.endLabel}.
- No generated fixture has a kickoff earlier than the generation timestamp.
- No generated fixture is already settled, in-play, postponed, or cancelled at generation time.
- Every club referenced in generated bet lines has a working local badge path for UI rendering, or a newly downloaded badge has been added and wired.
- Only local data files were modified.

Return format:
- Make the required file edits directly.
- After editing, briefly report:
  - the matchday id
  - the weekend date window
  - which proposal was marked AI recommended
  - the total odds for safe, balanced, and aggressive
  - how many Ladbrokes market rows were added
`;
}
