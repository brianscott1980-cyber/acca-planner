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
- Present a ranked shortlist of 2 or 3 proposed bets that fit the requested betting format.
- Update local repository data files only.
- Replace or create exactly one local custom-bet row for this event window.

Files you may update:
- data/custom_bets.ts
- public/assets/jockey_jerseys/*

Rules:
- Use Ladbrokes as the bookmaker of record unless the user explicitly says otherwise.
- Check the latest Ladbrokes prices and the structure of the requested event market before recommending the bet.
- Review the latest credible media context relevant to the sport:
  - horse racing: stable news, jockey booking, going, draw, rivals, prep signals, horse age, weight, official rating, recent form, ownership, and any other credible horse-specific factors typically used in race assessment
  - football: team news, club news, manager news, injuries, tactical changes, likely lineups
  - golf: player form, course fit, injury or fitness notes, weather, field strength
- Look for circumstances, tactics, and current news that could materially improve or weaken the chance of a positive betting outcome.
- Fetch local image assets only when they are genuinely useful to the app UI and come from a credible source.
- For horse-racing custom bets, download the jockey silks / jersey image for each proposed horse into public/assets/jockey_jerseys/ when available, and persist the local asset path in the proposed-bet detail block.
- For football custom bets, fetch club badges only when the involved clubs are not already covered by the local club asset set.
- For golf custom bets, fetch an event or player image only when there is a clear place to use it in the UI and a credible source.
- This is a one-off custom bet recommendation with no voting and no matchday card.
- The result must appear on the timeline as a Custom Bet and link to the custom bet page.
- Do not write to Supabase, do not run remote sync scripts, and do not update matchday files.
- Replace or regenerate only the row for this custom bet id if rerun.
- Newly generated custom bets should be created in a pending state, awaiting an admin to record the real placed details later.
- Custom bet ids and slugs must not be based on the event name alone.
- Prefix both with the event date so they stay unique, for example:
  - id: custom-bet-2026-04-11-grand-national-each-way
  - slug: 2026-04-11-grand-national-each-way
- Rank the proposed bets from most recommended to least recommended.
- The top-ranked proposed bet should still populate the primary recommendation fields used by the timeline and admin placement flow.
- Use the current pot as part of the recommendation, and produce a suggested stake amount for the custom bet.
- Suggested stake sizing must reflect:
  - current pot size
  - event volatility
  - whether the format is win-only, each-way, or otherwise more or less protective
  - the fact that a one-off custom bet should usually risk less of the pot than the main aggressive matchday stake
- Placement-specific fields must stay empty on generation:
  - stakeAmount
  - placedDecimalOdds
  - placedAtIso
- Staked custom bets are protected from future-clear scripts unless a force flag is explicitly used.
- The custom bet should still present the bet, odds, key event dates and times, and cashout advice in the same spirit as the matchday format.
- The custom bet should also include a suggested stake amount to invest based on the current pot.
- The AI analysis should cover the shortlist together rather than writing isolated notes for one pick only.
- Explain how the ranking was decided, what coverage or tradeoff each option provides, and which event/news factors most influenced the order.
- Give each proposed bet its own short summary line as well, so the UI can show per-bet feedback directly under the bet row.
- Custom-bet cashout advice must include:
  - lower cashout target
  - upper cashout target
  - no cashout value
  - event-specific moments, tactics, or watchouts that should affect the cashout decision live
- Cashout watchouts should be tailored to the sport:
  - horse racing: market drift, paddock signals, late going changes, jockey switches, pace-shape clues, horse fitness signs, and jumping rhythm
  - football: substitutions, tactical changes, red cards, injury setbacks, loss of territory or chance volume
  - golf: weather swings, visible fitness issues, leaderboard pressure, round-by-round momentum changes

Required custom bet row shape:
- id: deterministic slug-like id prefixed with the event date
- slug prefixed with the event date
- title
- state: pending
- sport: horse_racing, football, or golf
- bookmaker
- eventName
- competitionName
- bettingFormatRequested
- proposedBets as a ranked array of 2 or 3 entries
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
- suggestedStakeAmount
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
- Each proposedBets entry should include:
  - rank
  - market
  - selection
  - decimalOdds
  - summary
  - sport-specific structured detail when credible
- For horseRacing detail, include as many credible structured fields as available:
  - racecourse
  - raceTimeNote
  - horseName
  - trainer
  - jockey
  - silksImagePath
  - silksSourceUrl when known
  - age
  - weight
  - officialRating
  - recentForm
  - owner when known
  - going
  - distance
  - fieldSize
- For the recommended horse itself, always try to include the core racecard-style summary fields when credible:
  - officialRating
  - weight
  - age
  - recentForm in recognised racing notation such as 1421

Return format:
- Make the required file edits directly.
- After editing, briefly report:
  - the custom bet id
  - the sport
  - the event
  - the requested format
  - the shortlist in ranked order
  - the top recommended selection
  - the top recommended decimal odds
  - the suggested stake amount
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
