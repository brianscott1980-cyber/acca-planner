import type { MatchdayProposalRecord } from "../types/matchday_type";

export const matchdayProposals = [
  {
    "id": "proposal-md-1-aggressive",
    "gameWeekId": "md-1",
    "proposalId": "aggressive",
    "riskLevel": "aggressive",
    "title": "Aggressive Accumulator",
    "summary": "This chase version leans into two goals markets and still keeps Madrid and Leverkusen onside, holding the bigger swing for the later Sunday leg once the earlier anchors have had a chance to land.",
    "legs": 4,
    "statusLabel": "Upside",
    "betLineIds": [
      "betline-md-1-aggressive-leverkusen-win",
      "betline-md-1-aggressive-mallorca-real-btts",
      "betline-md-1-aggressive-real-win",
      "betline-md-1-aggressive-inter-roma-btts"
    ],
    "aiRecommended": null,
    "cashoutWatchList": [
      "This build is most exposed if Mallorca v Real Madrid starts cagey, so a slow game with few shots or an early attacking substitution is a serious warning for the BTTS leg.",
      "If Leverkusen do not pin Wolfsburg back early, do not ignore the upset signal just because it is the shortest-priced leg in the slip.",
      "The last swing sits with Inter v Roma BTTS, so any injury, substitution, or tactical change that removes one side's counter-attacking threat is a strong reason to consider cashing out."
    ]
  },
  {
    "id": "proposal-md-1-balanced",
    "gameWeekId": "md-1",
    "proposalId": "balanced",
    "riskLevel": "balanced",
    "title": "Balanced Accumulator",
    "summary": "The recommended middle route keeps two favourite outcomes but adds the stronger Milan goals angle, which suits a stable pot with no prior settled streak demanding a more defensive or more aggressive jump.",
    "legs": 3,
    "statusLabel": "Balance",
    "betLineIds": [
      "betline-md-1-balanced-bayern-win",
      "betline-md-1-balanced-real-win",
      "betline-md-1-balanced-inter-roma-btts"
    ],
    "aiRecommended": true,
    "cashoutWatchList": [
      "Reassess after Bayern and Madrid: if one favourite has won without much control, take that as a warning before letting the Sunday goals leg run.",
      "For Mallorca v Real Madrid, a Madrid defensive reshuffle or a key attacker being substituted can quickly change the BTTS path and make a mid-range cashout attractive.",
      "In Inter v Roma, stay alert for Roma growing into transitions or Inter losing their front-two intensity, because that shifts the BTTS leg from strong to fragile very quickly."
    ]
  },
  {
    "id": "proposal-md-1-safe",
    "gameWeekId": "md-1",
    "proposalId": "safe",
    "riskLevel": "safe",
    "title": "Defensive Accumulator",
    "summary": "Three straight result bets keep the weekend anchored to strong favourites and a home Inter side getting key attacking help back, protecting optionality while the pot is still flat at its opening level.",
    "legs": 3,
    "statusLabel": "Preserve",
    "betLineIds": [
      "betline-md-1-safe-bayern-win",
      "betline-md-1-safe-leverkusen-win",
      "betline-md-1-safe-inter-win"
    ],
    "aiRecommended": null,
    "cashoutWatchList": [
      "Protect value if Bayern fail to control territory early at Freiburg or if their main front-line threat is withdrawn before the hour mark.",
      "Leverkusen are the shortest leg in the chain, so an early Wolfsburg lead or visible drop in home pressure is the clearest upset warning for this slip.",
      "If Inter lose Lautaro's attacking threat through a substitution or setback, the final leg becomes less secure and an available cashout is easier to justify."
    ]
  },
  {
    "id": "proposal-md-2-aggressive",
    "gameWeekId": "md-2",
    "proposalId": "aggressive",
    "riskLevel": "aggressive",
    "title": "Aggressive Accumulator",
    "summary": "The upside build stacks both Champions League winners, adds a high-goals PSG-Liverpool angle, and finishes with a Braga result swing, creating the largest return profile but with clear multi-leg variance.",
    "legs": 4,
    "statusLabel": "Upside",
    "betLineIds": [
      "betline-md-2-aggressive-barcelona-win",
      "betline-md-2-aggressive-psg-win",
      "betline-md-2-aggressive-psg-liverpool-over-3-5",
      "betline-md-2-aggressive-braga-win"
    ],
    "aiRecommended": null,
    "cashoutWatchList": [
      "Do not ignore game-state warning signs in Paris SG v Liverpool: if the press intensity drops and tempo dies, the over 3.5 leg can collapse quickly.",
      "If Barcelona lead early but begin conceding field position and box entries, the risk profile changes and a strong cashout should be considered.",
      "Braga as the late swing leg carries the largest upset risk: if Betis dominate transitions or set-piece pressure, protect before full downside lands."
    ]
  },
  {
    "id": "proposal-md-2-balanced",
    "gameWeekId": "md-2",
    "proposalId": "balanced",
    "riskLevel": "balanced",
    "title": "Balanced Accumulator",
    "summary": "This middle profile keeps both headline Champions League winners and adds a goals-based Europa line, balancing stronger favourite pricing with one volatility booster rather than pushing into a full chase card.",
    "legs": 3,
    "statusLabel": "Balance",
    "betLineIds": [
      "betline-md-2-balanced-barcelona-win",
      "betline-md-2-balanced-psg-win",
      "betline-md-2-balanced-braga-betis-over-2-5"
    ],
    "aiRecommended": null,
    "cashoutWatchList": [
      "If one of the two Champions League favourites wins with poor chance creation, treat that as a warning before letting the Europa goals leg run.",
      "If PSG-Liverpool starts at a frantic tempo with early high-value chances, hold the edge; if it turns slow and compact, protect earlier than usual.",
      "For Braga-Betis over 2.5, a low-shot first half with conservative shape from both sides is the clearest signal to take a mid-range cashout."
    ]
  },
  {
    "id": "proposal-md-2-safe",
    "gameWeekId": "md-2",
    "proposalId": "safe",
    "riskLevel": "safe",
    "title": "Defensive Accumulator",
    "summary": "With bankroll drawdown after Matchday 1, the defensive route uses two draw-no-bet protections plus one shorter Champions League favourite so we can keep upside alive without exposing the full stake to one upset.",
    "legs": 3,
    "statusLabel": "Protect",
    "betLineIds": [
      "betline-md-2-safe-barcelona-win",
      "betline-md-2-safe-psg-dnb",
      "betline-md-2-safe-betis-dnb"
    ],
    "aiRecommended": true,
    "cashoutWatchList": [
      "If Barcelona lose territorial control early or sit too deep after leading, protect value before the later legs increase variance.",
      "For Paris SG v Liverpool, any late defensive reshuffle or early injury in the PSG back line is a key trigger to reduce risk.",
      "In Braga v Real Betis, if Betis lose midfield control and are pinned in for long phases, take a pragmatic cashout instead of forcing full settlement."
    ]
  },
  {
    "id": "proposal-md-3-aggressive",
    "gameWeekId": "md-3",
    "proposalId": "aggressive",
    "riskLevel": "aggressive",
    "title": "Aggressive Accumulator",
    "summary": "The chase build targets the higher-volatility Sunday and Monday tiers, looking for a Leeds stalemate and a Sunderland upset to aggressively multiply the remaining pot if early triggers land.",
    "legs": 3,
    "statusLabel": "Upside",
    "betLineIds": [
      "betline-md-3-aggressive-leeds-brentford-draw",
      "betline-md-3-aggressive-sunderland-win",
      "betline-md-3-aggressive-bournemouth-forest-over-2-5"
    ],
    "aiRecommended": null,
    "cashoutWatchList": [
      "The Leeds Draw depends on a controlled tempo; if either side starts chasing the game or goes down to 10 men, the value in the draw collapses.",
      "Sunderland are the biggest swing in the slip: if Burnley dominate the opening 20 mins and pin them back, take a protective exit quickly.",
      "Bournemouth goals frequency is high, but if Forest play for a point with a back five, the over 2.5 leg shifts from a value bet to a risky hold."
    ]
  },
  {
    "id": "proposal-md-3-balanced",
    "gameWeekId": "md-3",
    "proposalId": "balanced",
    "riskLevel": "balanced",
    "title": "Balanced Accumulator",
    "summary": "The balanced route leans into three high-volume goal markets. Instead of tracking specific results, we are backing the clinical form of Brighton, Spurs, and Newcastle attackers in what look like open matchups.",
    "legs": 3,
    "statusLabel": "Momentum",
    "betLineIds": [
      "betline-md-3-balanced-chelsea-brighton-over-2-5",
      "betline-md-3-balanced-spurs-villa-btts",
      "betline-md-3-balanced-united-newcastle-btts"
    ],
    "aiRecommended": null,
    "cashoutWatchList": [
      "For Chelsea v Brighton, an early goal for either side usually opens this fixture, but a 0-0 at half-time with low xG is a clear exit trigger.",
      "Spurs have been open in transition; if they adopt a surprisingly narrow or deep shape to counter Villa, the BTTS probability drops and cashout value peaks.",
      "In the Utd v Newcastle game, stay alert for key attacking personnel being rotated or substituted early, as the goals market depends on current frontline starters."
    ]
  },
  {
    "id": "proposal-md-3-safe",
    "gameWeekId": "md-3",
    "proposalId": "safe",
    "riskLevel": "safe",
    "title": "Defensive Accumulator",
    "summary": "Following the recent pot consolidation, this protective build uses three high-probability anchors: Arsenal's home strength, clinical finishing in the City game, and Liverpool's derby consistency to rebuild the base.",
    "legs": 3,
    "statusLabel": "Rebuild",
    "betLineIds": [
      "betline-md-3-safe-arsenal-win",
      "betline-md-3-safe-mancity-westham-over-1-5",
      "betline-md-3-safe-liverpool-win"
    ],
    "aiRecommended": true,
    "cashoutWatchList": [
      "A slow Arsenal start with poor conversion is the main warning; if Fulham defend deep and compact for 60 mins, protect the stake.",
      "In the City game, if the pattern shifts to a conservative tactical standoff with few shots, the over 1.5 leg becomes a risk worth monitoring.",
      "DERBY ALERT: If Liverpool lose control of the midfield transition or face early set-piece pressure, consider a defensive cashout before the final leg."
    ]
  }
] as unknown as MatchdayProposalRecord[];
