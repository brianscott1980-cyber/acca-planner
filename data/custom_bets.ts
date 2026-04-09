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
  {
    id: "custom-bet-2026-04-09-porto-bologna-bet-builder",
    slug: "2026-04-09-porto-bologna-bet-builder",
    title: "Europa League Tonight Bet Builder (Porto + Bologna Matches)",
    state: "pending",
    customBetType: "standard",
    sport: "football",
    bookmaker: "Ladbrokes",
    eventName: "Porto vs Nottingham Forest + Bologna vs Aston Villa",
    competitionName: "UEFA Europa League Quarter-Finals",
    bettingFormatRequested: "Bet Builder",
    proposedBets: [
      {
        rank: 1,
        market: "Two-Match Bet Builder",
        selection:
          "Porto Draw No Bet + Porto/Forest Under 3.5 Goals + Bologna/Villa Under 3.5 Goals",
        decimalOdds: 3.6,
        suggestedStakeAmount: 3.5,
        summary:
          "Most balanced builder: protects against a Porto draw while leaning into the lower-total profile suggested by both first-leg setups.",
      },
      {
        rank: 2,
        market: "Two-Match Bet Builder",
        selection:
          "Porto Win + Porto/Forest Under 3.5 Goals + Bologna/Villa Under 3.5 Goals",
        decimalOdds: 4.9,
        suggestedStakeAmount: 2.5,
        summary:
          "Higher payout path built on Porto home edge plus controlled goal totals across both quarter-final first legs.",
      },
      {
        rank: 3,
        market: "Two-Match Bet Builder",
        selection:
          "Porto or Draw + Bologna or Draw + Under 4.5 Goals in both matches",
        decimalOdds: 3.2,
        suggestedStakeAmount: 2,
        summary:
          "Most conservative cover route with double-chance protection in both ties and a wider total-goals cap.",
      },
    ],
    recommendedMarket: "Two-Match Bet Builder",
    recommendedSelection:
      "Porto Draw No Bet + Porto/Forest Under 3.5 Goals + Bologna/Villa Under 3.5 Goals",
    decimalOdds: 3.6,
    summary:
      "Tonight-only Europa League bet-builder shortlist across Porto and Bologna ties, with a risk-managed best option anchored on Porto DNB and unders in both games.",
    analysisSummary:
      "Quarter-final context pass: UEFA previews for both ties frame first legs as tactically tight with progression still open for second legs, which supports lower-goal assumptions rather than all-out attacking builds. Pricing pass: current odds boards for Porto vs Nottingham Forest and Bologna vs Aston Villa show Porto as a modest favourite and Bologna/Villa closer to pick'em, so the ranking prioritises draw protection on Porto and total-goals controls over brittle winner-only combinations. Team-news and form pass: credible reporting indicates Forest receive a boost with Chris Wood returning, while both ties still profile as disciplined knockout matches where managers are likely to protect second-leg optionality. Pot/risk pass: with pot around GBP35 and recent performance not yet strongly improving, total suggested outlay is held at GBP8 and split across three correlated builders rather than one large position. Source log (11): UEFA Europa League quarter-final first-leg preview hub, UEFA Porto vs Nottingham Forest preview, UEFA Bologna vs Aston Villa preview, ESPN FC Porto fixtures page, ESPN Bologna fixtures page, Oddschecker Porto vs Nottingham Forest market board, Oddschecker Bologna vs Aston Villa market board, Guardian Forest Europa League coverage, MyKhel Nottingham Forest-Porto schedule report, Reddit r/avfc pre-match thread (Bologna vs Aston Villa), Reddit r/soccer Europa League discussion posts. Evidence confidence: medium (good fixture and market agreement; some lineup uncertainty before confirmed XIs). Public sentiment check: Reddit/social sentiment leans toward cautious respect for Villa and Porto edges, broadly aligned with model-led conservative builders rather than high-variance goal-heavy bets.",
    mediaSummary:
      "UEFA and mainstream coverage suggest two controlled first legs where marginal advantages matter more than wide-open scorelines, so the shortlist favours draw protection and restrained goal bands over aggressive winner-and-overs combinations.",
    timelineTitle: "Custom Bet: Porto + Bologna Tonight Bet Builder",
    timelineDescription:
      "Pending two-match Europa League bet builder added for tonight's Porto and Bologna quarter-final first legs with GBP8 total suggested stake.",
    generatedAtIso: "2026-04-09T16:40:00.000Z",
    eventStartIso: "2026-04-09T17:45:00.000Z",
    eventEndIso: "2026-04-09T22:15:00.000Z",
    suggestedStakeAmount: 8,
    cashoutLowerTarget: "GBP11",
    cashoutUpperTarget: "GBP17",
    noCashoutValue:
      "If both matches are level or within one goal entering the final 15 minutes and your totals legs remain live, hold for full settlement unless in-game red cards materially alter shot volume.",
    cashoutAdvice: [
      "Consider early partial cashout if Porto concede first and live xG trend turns strongly against the DNB protection.",
      "If Bologna/Villa becomes stretched with an early second-half goal and repeated transition chances, de-risk unders exposure.",
      "Hold more confidently when both games remain within expected tactical tempo and no key defensive injury or red-card shock appears.",
    ],
    watchPoints: [
      "Any red card or forced defensive reshuffle that can break the under-goals setup.",
      "Shot-volume spike after halftime in Bologna vs Aston Villa, especially if one side chases.",
      "Porto pressure sustainability at home versus Forest counter threat.",
    ],
    riskFactors: [
      "Bet-builder legs are correlated, so one game-state shift can impact multiple legs.",
      "Quarter-final first legs can flip quickly after substitutions around 60-75 minutes.",
      "Pre-match prices can move materially once confirmed lineups are released.",
    ],
    football: {
      fixture: "Porto vs Nottingham Forest; Bologna vs Aston Villa",
      kickoffNote: "Thursday 9 April 2026 (UEFA Europa League QF first legs)",
      competition: "UEFA Europa League",
      marketType: "Two-Match Bet Builder",
      teamNews: [
        "UEFA previews frame both ties as close quarter-final first legs with second-leg context likely to temper risk-taking.",
        "Nottingham Forest reportedly have Chris Wood available again, adding a different attacking profile versus recent matches.",
        "Bologna and Aston Villa are meeting again after prior recent European meetings, reducing surprise-factor tactical edges.",
      ],
      tacticalAngles: [
        "First-leg knockout dynamics generally support controlled tempos and lower-goal outcomes.",
        "Porto home advantage is reflected in pricing, but draw protection improves resilience for a two-match builder.",
        "Bologna/Villa market prices are tighter, so total-goals controls are preferred to picking a hard side winner.",
      ],
    },
  },
  {
    id: "custom-bet-2026-04-11-grand-national-win",
    slug: "2026-04-11-grand-national-win",
    title: "Grand National 2026 (Win Only)",
    state: "pending",
    customBetType: "standard",
    sport: "horse_racing",
    bookmaker: "Ladbrokes",
    eventName: "Randox Grand National",
    competitionName: "Aintree Grand National Festival",
    bettingFormatRequested: "Win",
    proposedBets: [
      {
        rank: 1,
        market: "Grand National Winner (Win Only)",
        selection: "I Am Maximus",
        decimalOdds: 8,
        suggestedStakeAmount: 3,
        summary:
          "Most reliable profile in this field: proven National stamina, course form, and a stable that repeatedly targets this race.",
        horseRacing: {
          trainer: "Willie Mullins",
          jockey: "Paul Townend",
          age: 10,
          recentForm: "8292-5",
        },
      },
      {
        rank: 2,
        market: "Grand National Winner (Win Only)",
        selection: "Grangeclare West",
        decimalOdds: 11,
        suggestedStakeAmount: 3,
        summary:
          "Strong staying profile with last-year course evidence; slightly bigger price than the favourite with similar stable confidence.",
        horseRacing: {
          trainer: "Willie Mullins",
          jockey: "Patrick Mullins",
        },
      },
      {
        rank: 3,
        market: "Grand National Winner (Win Only)",
        selection: "Monty's Star",
        decimalOdds: 21,
        suggestedStakeAmount: 2,
        summary:
          "Higher-volatility upside runner for payout leverage, included as controlled third exposure behind the two shorter Mullins options.",
        horseRacing: {
          trainer: "Henry de Bromhead",
          jockey: "Darragh O'Keeffe",
          age: 9,
        },
      },
    ],
    recommendedMarket: "Grand National Winner (Win Only)",
    recommendedSelection: "I Am Maximus",
    decimalOdds: 8,
    summary:
      "Three-horse Grand National win-only shortlist with I Am Maximus top ranked and total suggested outlay capped at GBP8.",
    analysisSummary:
      "Race setup pass: the 2026 Grand National is a 34-runner field with welfare-era pacing still demanding stamina and efficient jumping rather than pure speed; that supports a proven stayer-first ranking. Market pass: consensus odds boards keep I Am Maximus as the headline contender with Grangeclare West and other double-digit alternatives close behind, so the shortlist is concentrated near the top of the proven profile cluster rather than spraying longshots. Stable/news pass: Aintree coverage indicates major Mullins and Elliott representation plus late field changes, reinforcing the need to prioritize runners with dependable completion profiles in big-field chaos. Learning-feedback pass: no stored historical feedback rows are present, so sizing remains bankroll-protective and process-led. Source log (10): racingpost.com (2026 Grand National runners/odds guide), thejockeyclub.co.uk (Aintree declarations update), sportinglife.com (Aintree racecards + horse profiles), espn.com (horse profile/form context), theguardian.com (Aintree coverage), talksport.com (runners/declarations summary), oddschecker.com (Grand National market boards), reddit.com/r/HorseRacingUK (Grand National discussion), reddit.com/r/sportsbook (general betting sentiment), reddit.com/r/horseracing (community sentiment signal). Evidence confidence: medium (strong agreement on leading contenders; unavoidable volatility in a 34-runner handicap chase). Public sentiment check: social chatter is mixed and often anecdotal, but broadly supportive of the main market leaders rather than a single contrarian outsider.",
    mediaSummary:
      "Coverage across major racing outlets points to a familiar theme: respect proven National form and completion reliability first, then add one higher-odds upside runner for payout balance.",
    timelineTitle: "Custom Bet: Grand National Win Card",
    timelineDescription:
      "Pending win-only Grand National shortlist added with I Am Maximus as primary recommendation and controlled GBP8 suggested stake.",
    generatedAtIso: "2026-04-09T18:05:00.000Z",
    eventStartIso: "2026-04-11T15:00:00.000Z",
    eventEndIso: "2026-04-11T17:00:00.000Z",
    suggestedStakeAmount: 8,
    cashoutLowerTarget: "GBP12",
    cashoutUpperTarget: "GBP24",
    noCashoutValue:
      "If your lead selection is travelling within striking distance after the second Canal Turn and jumping cleanly, prefer holding unless race tempo collapses.",
    cashoutAdvice: [
      "Take partial cashout if your top pick is under pressure before the final two fences and market drift accelerates.",
      "Hold when your selection is still on the bridle deep into the run-in with no major jumping errors recorded.",
      "De-risk if late going deterioration or a pace collapse materially changes the in-running shape against your shortlist.",
    ],
    watchPoints: [
      "Jumping fluency through Becher's and Canal Turn sections.",
      "In-running pace pressure versus energy conservation for final circuit.",
      "Any late going change announcements and their effect on stamina-heavy runners.",
    ],
    riskFactors: [
      "Large-field National variance remains high even for favourites.",
      "Single jumping errors can immediately destroy win equity.",
      "Late non-runners and jockey switches can alter race shape near off time.",
    ],
    horseRacing: {
      racecourse: "Aintree",
      raceTimeNote: "Saturday 11 April 2026, 16:00 local",
      horseName: "I Am Maximus",
      trainer: "Willie Mullins",
      jockey: "Paul Townend",
      age: 10,
      recentForm: "8292-5",
      going: "Official update pending closer to race time",
      distance: "4m 2f 74y",
      fieldSize: 34,
      notableRivals: [
        {
          name: "Grangeclare West",
        },
        {
          name: "Monty's Star",
        },
        {
          name: "Iroko",
        },
      ],
    },
  },
] as unknown as CustomBetRecord[];
