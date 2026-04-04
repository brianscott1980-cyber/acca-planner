create or replace function public.fetch_app_data_snapshot()
returns jsonb
language sql
stable
security invoker
as $$
  select jsonb_build_object(
    'users',
    coalesce((select jsonb_agg(to_jsonb(users_row)) from public.users as users_row), '[]'::jsonb),
    'leagueClubs',
    coalesce(
      (select jsonb_agg(to_jsonb(clubs_row)) from public.league_clubs as clubs_row),
      '[]'::jsonb
    ),
    'marketAnalysisSnapshotRows',
    coalesce(
      (
        select jsonb_agg(to_jsonb(snapshots_row))
        from public.market_analysis_snapshots as snapshots_row
      ),
      '[]'::jsonb
    ),
    'marketAnalysisSelectionRows',
    coalesce(
      (
        select jsonb_agg(to_jsonb(selections_row))
        from public.market_analysis_selections as selections_row
      ),
      '[]'::jsonb
    ),
    'matchdayGameWeeks',
    coalesce(
      (
        select jsonb_agg(to_jsonb(matchday_weeks_row))
        from public.matchday_game_weeks as matchday_weeks_row
      ),
      '[]'::jsonb
    ),
    'matchdayProposals',
    coalesce(
      (
        select jsonb_agg(to_jsonb(proposals_row))
        from public.matchday_proposals as proposals_row
      ),
      '[]'::jsonb
    ),
    'matchdayBetLines',
    coalesce(
      (
        select jsonb_agg(to_jsonb(bet_lines_row))
        from public.matchday_bet_lines as bet_lines_row
      ),
      '[]'::jsonb
    ),
    'matchdayForms',
    coalesce(
      (
        select jsonb_agg(to_jsonb(forms_row))
        from public.matchday_forms as forms_row
      ),
      '[]'::jsonb
    ),
    'matchdayFormMatches',
    coalesce(
      (
        select jsonb_agg(to_jsonb(form_matches_row))
        from public.matchday_form_matches as form_matches_row
      ),
      '[]'::jsonb
    ),
    'customBets',
    coalesce(
      (
        select jsonb_agg(to_jsonb(custom_bets_row))
        from public.custom_bets as custom_bets_row
      ),
      '[]'::jsonb
    ),
    'leagueDataMeta',
    coalesce(
      (
        select jsonb_agg(to_jsonb(league_meta_row))
        from public.league_data_meta as league_meta_row
      ),
      '[]'::jsonb
    ),
    'leagueDataMatchdaySimulations',
    coalesce(
      (
        select jsonb_agg(to_jsonb(simulations_row))
        from public.league_data_matchday_simulations as simulations_row
      ),
      '[]'::jsonb
    ),
    'leagueDataVotes',
    coalesce(
      (
        select jsonb_agg(to_jsonb(votes_row))
        from public.league_data_votes as votes_row
      ),
      '[]'::jsonb
    ),
    'leagueDataBetLineOdds',
    coalesce(
      (
        select jsonb_agg(to_jsonb(odds_row))
        from public.league_data_bet_line_odds as odds_row
      ),
      '[]'::jsonb
    ),
    'leagueDataSlips',
    coalesce(
      (
        select jsonb_agg(to_jsonb(slips_row))
        from public.league_data_slips as slips_row
      ),
      '[]'::jsonb
    ),
    'leagueDataLegResults',
    coalesce(
      (
        select jsonb_agg(to_jsonb(leg_results_row))
        from public.league_data_leg_results as leg_results_row
      ),
      '[]'::jsonb
    ),
    'ledgerData',
    coalesce(
      (select jsonb_agg(to_jsonb(ledger_row)) from public.ledger_data as ledger_row),
      '[]'::jsonb
    ),
    'timelineEvents',
    coalesce(
      (
        select jsonb_agg(to_jsonb(timeline_events_row))
        from public.timeline_events as timeline_events_row
      ),
      '[]'::jsonb
    ),
    'matchdayOutcomes',
    coalesce(
      (
        select jsonb_agg(to_jsonb(matchday_outcomes_row))
        from public.matchday_outcomes as matchday_outcomes_row
      ),
      '[]'::jsonb
    ),
    'customBetOutcomes',
    coalesce(
      (
        select jsonb_agg(to_jsonb(custom_bet_outcomes_row))
        from public.custom_bet_outcomes as custom_bet_outcomes_row
      ),
      '[]'::jsonb
    ),
    'betLearningFeedback',
    '[]'::jsonb
  );
$$;

grant execute on function public.fetch_app_data_snapshot() to authenticated;
