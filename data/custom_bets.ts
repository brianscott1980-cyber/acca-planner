import type { CustomBetRecord } from "../types/custom_bet_type";

export const customBets = [
  {
    id: "custom-bet-2026-04-09-masters-tournament-win",
    slug: "2026-04-09-masters-tournament-win",
    title: "Masters Tournament 2026 Outright (Win)",
    state: "pending",
    sport: "golf",
    bookmaker: "Ladbrokes",
    eventName: "Masters Tournament",
    competitionName: "PGA Major Championship",
    bettingFormatRequested: "Win",
    proposedBets: [
      {
        rank: 1,
        market: "Tournament Winner (Win Only)",
        selection: "Scottie Scheffler",
        decimalOdds: 6,
        suggestedStakeAmount: 3,
        summary:
          "Best blend of Augusta fit and current market respect; still short but the most reliable profile for this card.",
      },
      {
        rank: 2,
        market: "Tournament Winner (Win Only)",
        selection: "Jon Rahm",
        decimalOdds: 9,
        suggestedStakeAmount: 3,
        summary:
          "Stronger price than the favourite with elite major-winning ceiling; slightly higher volatility than Scheffler.",
      },
      {
        rank: 3,
        market: "Tournament Winner (Win Only)",
        selection: "Ludvig Aberg",
        decimalOdds: 13,
        suggestedStakeAmount: 2,
        summary:
          "Higher-upside outsider in the same outright market, included for payout leverage while keeping total stake controlled.",
      },
    ],
    recommendedMarket: "Tournament Winner (Win Only)",
    recommendedSelection: "Scottie Scheffler",
    decimalOdds: 6,
    summary:
      "Three-player outright shortlist for the 2026 Masters with Scheffler top-ranked and total suggested outlay capped at GBP8.",
    analysisSummary:
      "Course/weather pass: Augusta is forecast to play firm and relatively dry with manageable wind, which generally rewards elite tee-to-green control and precise approach play over pure short-term putting streaks. That profile supports Scheffler remaining the best baseline fit, with Rahm next on major-winning upside and Aberg retained as controlled higher-volatility exposure. Public-sentiment pass (Reddit/social + betting media): community chatter and model pieces are more split than the market, with significant Rahm/Xander/Cam Young enthusiasm and some 'fade Scheffler' narratives, but consensus still places Scheffler and Rahm in the top contender cluster. With pot around GBP35 after two losses, total stake stays conservative at GBP8. No stored learning-feedback rows currently exist, so bankroll protection remains the main sizing constraint. Source log (12): masters.com, pgatour.com, owgr.com/current-world-ranking, owgr.com/playerprofile/scottie-scheffler-18417, owgr.com/playerprofile/jon-rahm-19195, weather.com/sports-recreation/video/augusta-national-masters-weather-ludvig-aberg-betting, nbcsports.com/golf/news/2026-masters-tournament-full-91-player-field-and-how-they-qualified, golf.com/news/how-watch-2026-masters-tv-schedule-streaming-tee-times, cbssports.com/golf/news/2026-masters-odds-field-pga-picks-scottie-scheffler-rory-mcilroy-jon-rahm-predictions, theanalyst.com/articles/2026-masters-picks-odds-value-plays-fracas-predictions-for-green-jacket, reddit.com/r/golf/comments/1sgm8ly/official_tournament_discussion_thread_2026, reddit.com/r/sportsbook/comments/1sdgyjh/masters_2026_golf. Evidence confidence: medium-high (good cross-source agreement on contender tier, disagreement on exact #1). Public sentiment check: mixed-to-contrarian versus books, but not strong enough to overturn the core ranking.",
    mediaSummary:
      "Trusted golf coverage and model previews agree Augusta conditions should reward high-end ball-strikers, while social sentiment appears more fragmented and value-seeking than bookmaker pricing; that combination keeps a favourite-led card but justifies retaining one upside alternative in the shortlist.",
    timelineTitle: "Custom Bet: Masters 2026 Outright",
    timelineDescription:
      "Pending win-only Masters shortlist added with Scheffler as the primary selection and controlled GBP8 total suggested stake.",
    generatedAtIso: "2026-04-09T13:45:00.000Z",
    eventStartIso: "2026-04-09T11:00:00.000Z",
    eventEndIso: "2026-04-12T22:00:00.000Z",
    suggestedStakeAmount: 8,
    cashoutLowerTarget: "GBP12",
    cashoutUpperTarget: "GBP22",
    noCashoutValue:
      "If the top pick is within two shots of the lead entering the back nine on Sunday, prefer holding unless conditions deteriorate sharply.",
    cashoutAdvice: [
      "Take partial cashout if your backed player drifts beyond +2200 after Round 2 and loses strokes on approach in consecutive rounds.",
      "Lean toward hold when your selection is gaining strokes tee-to-green through 36 holes even if putting is neutral.",
      "If extreme weather change is forecast before your selection's tee time versus main rivals, consider de-risking early.",
    ],
    watchPoints: [
      "Round-by-round approach-play trend versus field.",
      "Wind and firmness changes at Augusta affecting iron control into fast greens.",
      "Leaderboard pressure signals on Sunday: conservative misses and short-putt conversion.",
    ],
    riskFactors: [
      "Outright market variance is high even for favourites.",
      "A single poor nine-hole stretch can erase win equity quickly.",
      "Weather draw bias can materially shift probabilities after markets are placed.",
    ],
    golf: {
      tournament: "Masters Tournament",
      course: "Augusta National Golf Club",
      marketType: "Tournament Winner (Win Only)",
      playerName: "Scottie Scheffler",
      keyStats: [
        "Augusta-winning profile with repeated elite tee-to-green output.",
        "Market-leading price on Ladbrokes outright board reflects strongest baseline probability.",
        "Short-game volatility lower than most contenders in comparable odds tier.",
      ],
      fieldAngles: [
        "Rahm and McIlroy remain credible major threats and cap upside on any single-name outright.",
        "Fast greens and Sunday pressure historically favour major winners with controlled shot windows.",
        "Card construction uses one favourite plus two higher-price options to balance hit-rate and payout.",
      ],
    },
  },
] as unknown as CustomBetRecord[];
