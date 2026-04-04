#!/usr/bin/env node

const args = parseArgs(process.argv.slice(2));
const generatedAt = formatDateTime(new Date());

process.stdout.write(renderInstructionBlock({ generatedAt, args }));

function parseArgs(rawArgs) {
  const scope = getArg(rawArgs, "--scope") ?? "all";
  const lookbackDaysRaw = getArg(rawArgs, "--lookback-days") ?? "30";
  const reviewer = getArg(rawArgs, "--reviewer") ?? "AI";
  const lookbackDays = Number.parseInt(lookbackDaysRaw, 10);

  if (!Number.isFinite(lookbackDays) || lookbackDays <= 0) {
    throw new Error(`Invalid --lookback-days value "${lookbackDaysRaw}". Use a positive integer.`);
  }

  if (!["all", "matchday", "custom"].includes(scope)) {
    throw new Error(`Invalid --scope value "${scope}". Use all, matchday, or custom.`);
  }

  return { scope, lookbackDays, reviewer };
}

function getArg(rawArgs, name) {
  const matchedArg = rawArgs.find((arg) => arg.startsWith(`${name}=`));
  return matchedArg ? matchedArg.slice(name.length + 1).trim() : null;
}

function formatDateTime(date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/London",
  }).format(date);
}

function renderInstructionBlock({ generatedAt, args }) {
  return `Repeatable completed-bets review instruction generated ${generatedAt} (Europe/London)

Use this as the full operating brief for the LLM.

Requested review scope:
- Scope: ${args.scope}
- Lookback window: last ${args.lookbackDays} day(s)
- Reviewer label: ${args.reviewer}

Instruction for the LLM:

You are updating the local mock data in the acca-planner repository.

Goal:
- Review completed bets (${args.scope}) and capture learning feedback for future proposal generation.
- Use completed outcomes, leg-level context, latest credible news, and fan feedback to explain what happened.
- Record why each reviewed bet was successful or unsuccessful.
- Write durable learning notes that the next proposal-generation run can use.

Files you may read:
- data/matchday_game_weeks.ts
- data/matchday_proposals.ts
- data/matchday_bet_lines.ts
- data/custom_bets.ts
- data/matchday_outcomes.ts
- data/custom_bet_outcomes.ts
- data/ledger_data.ts
- data/league_data_slips.ts
- data/league_data_leg_results.ts
- data/bet_learning_feedback.ts

Files you may update:
- data/bet_learning_feedback.ts

Rules:
- Review only completed bets in the requested scope and lookback window.
- For each reviewed bet, evaluate:
  - what happened overall
  - what happened on each leg or key sub-component
  - what latest credible news signals aligned or conflicted with the result
  - what fan-feedback or sentiment signals aligned or conflicted with the result
  - what the model should do differently next time
- News and fan feedback must be used as explanatory context, not as guaranteed predictive truth.
- Keep lessons specific and actionable. Avoid generic statements like "be more careful".
- Do not modify matchday proposals, custom bet rows, ledger rows, or simulation rows in this workflow.
- Do not write to Supabase and do not run remote sync scripts.

Required output contract in data/bet_learning_feedback.ts:
- Upsert one feedback row per reviewed bet id.
- Use a deterministic id format:
  - feedback-matchday-<betId>
  - feedback-custom-<betId>
- Keep betType as matchday or custom.
- Populate:
  - betId, betTitle, completedAtIso, outcome
  - stakeAmount and returnAmount when known
  - roiPercent when stake and return are known
  - summary
  - one of whySuccessful or whyUnsuccessful (or both when mixed)
  - newsSummary
  - fanFeedbackSummary
  - legFeedback array with per-leg lessons
  - nextBetAdjustments
  - modelPromptNotes
  - confidenceCalibration
  - reviewer = ${args.reviewer}
- Preserve existing feedback rows that are outside the current scope or lookback window.

How future generation uses this:
- The next matchday/custom-bet proposal instruction must read data/bet_learning_feedback.ts first.
- Recommendations should explicitly avoid repeating recently failed patterns unless new evidence justifies the change.

Return format:
- Make the required file edits directly.
- After editing, briefly report:
  - number of bets reviewed
  - number of feedback rows created
  - number of feedback rows updated
  - top 3 recurring lessons
`;
}
