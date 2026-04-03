#!/usr/bin/env node

const args = parseArgs(process.argv.slice(2));

process.stdout.write(`Repeatable custom bet instruction

Use this as the full operating brief for the LLM.

Requested sport:
- ${args.sport}

Requested event:
- ${args.event}

Requested betting format:
- ${args.format}

Requested date window:
- Start: ${args.start}
- End: ${args.end}

Instruction for the LLM:

You are updating the local mock data in the acca-planner repository.

Goal:
- Monitor the requested sport and event as a one-off custom bet, not a matchday vote.
- Review the Ladbrokes market and relevant media coverage.
- Present one recommended bet that fits the requested betting format.
- Update local repository data files only.

Files you may update:
- data/custom_bets.ts

Rules:
- Use Ladbrokes as the bookmaker of record unless the user explicitly says otherwise.
- Check the latest Ladbrokes prices and the structure of the requested event market before recommending the bet.
- Review the latest credible media context relevant to the sport:
  - horse racing: stable news, jockey booking, going, draw, rivals, prep signals
  - football: team news, club news, manager news, injuries, tactical changes, likely lineups
  - golf: player form, course fit, injury or fitness notes, weather, field strength
- Look for circumstances, tactics, and current news that could materially improve or weaken the chance of a positive betting outcome.
- This is a one-off custom bet recommendation with no voting and no matchday card.
- The result must appear on the timeline as a Custom Bet and link to the custom bet page.
- Do not write to Supabase, do not run remote sync scripts, and do not update matchday files.
- Replace or regenerate only the row for this custom bet id if rerun.
- Newly generated custom bets should be created in a pending state, awaiting an admin to record the real placed details later.
- The custom bet should still present the bet, odds, key event dates and times, and cashout advice in the same spirit as the matchday format.
- Custom-bet cashout advice must include:
  - lower cashout target
  - upper cashout target
  - no cashout value
  - event-specific moments, tactics, or watchouts that should affect the cashout decision live
- Cashout watchouts should be tailored to the sport:
  - horse racing: market drift, paddock signals, late going changes, jockey switches, pace-shape clues
  - football: substitutions, tactical changes, red cards, injury setbacks, loss of territory or chance volume
  - golf: weather swings, visible fitness issues, leaderboard pressure, round-by-round momentum changes

Required custom bet row shape:
- id: deterministic slug-like id for the event and format
- slug
- title
- state: pending
- sport: horse_racing, football, or golf
- bookmaker
- eventName
- competitionName
- bettingFormatRequested
- recommendedMarket
- recommendedSelection
- decimalOdds
- summary
- analysisSummary
- mediaSummary
- timelineTitle
- timelineDescription
- generatedAtIso
- eventStartIso
- eventEndIso when known
- stakeAmount: leave empty on generation
- placedDecimalOdds: leave empty on generation
- placedAtIso: leave empty on generation
- cashoutLowerTarget
- cashoutUpperTarget
- noCashoutValue
- cashoutAdvice
- watchPoints
- riskFactors
- sport-specific detail block under horseRacing, football, or golf

Return format:
- Make the required file edits directly.
- After editing, briefly report:
  - the custom bet id
  - the sport
  - the event
  - the requested format
  - the recommended selection
  - the decimal odds
`);

function parseArgs(rawArgs) {
  const sport = getArg(rawArgs, "--sport") ?? "horse_racing";
  const event = getArg(rawArgs, "--event") ?? "Grand National";
  const format = getArg(rawArgs, "--format") ?? "Win";
  const start = getArg(rawArgs, "--start") ?? "2026-04-06T09:00:00.000Z";
  const end = getArg(rawArgs, "--end") ?? "2026-04-06T23:00:00.000Z";

  return { sport, event, format, start, end };
}

function getArg(rawArgs, name) {
  const matchedArg = rawArgs.find((arg) => arg.startsWith(`${name}=`));
  return matchedArg ? matchedArg.slice(name.length + 1).trim() : null;
}
