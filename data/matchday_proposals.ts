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
  }
] as unknown as MatchdayProposalRecord[];
