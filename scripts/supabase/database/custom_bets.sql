create table if not exists public.custom_bets (
  id text not null,
  slug text,
  title text,
  state text check (state in ('pending', 'staked')),
  custom_bet_type text check (custom_bet_type in ('standard', 'free_bet_offer')),
  sport text check (sport in ('horse_racing', 'football', 'golf')),
  bookmaker text check (bookmaker in ('Ladbrokes')),
  event_name text,
  competition_name text,
  betting_format_requested text,
  proposed_bets jsonb,
  recommended_market text,
  recommended_selection text,
  decimal_odds numeric(10, 2),
  summary text,
  analysis_summary text,
  media_summary text,
  timeline_title text,
  timeline_description text,
  generated_at_iso timestamptz,
  event_start_iso timestamptz,
  event_end_iso timestamptz,
  suggested_stake_amount numeric(12, 2),
  is_free_stake boolean,
  placed_proposal_rank integer check (placed_proposal_rank in (1, 2, 3)),
  placed_market text,
  placed_selection text,
  stake_amount numeric(12, 2),
  placed_decimal_odds numeric(10, 2),
  placed_at_iso timestamptz,
  outcome_status text check (outcome_status in ('won', 'lost', 'cashed_out')),
  outcome_value_amount numeric(12, 2),
  outcome_at_iso timestamptz,
  outcome_summary text,
  outcome_submitted_by text,
  cashout_lower_target text,
  cashout_upper_target text,
  no_cashout_value text,
  cashout_advice jsonb,
  watch_points jsonb,
  risk_factors jsonb,
  horse_racing jsonb,
  football jsonb,
  golf jsonb,
  primary key (id),
  unique (slug)
);

alter table public.custom_bets add column if not exists outcome_status text check (outcome_status in ('won', 'lost', 'cashed_out'));
alter table public.custom_bets add column if not exists outcome_value_amount numeric(12, 2);
alter table public.custom_bets add column if not exists outcome_at_iso timestamptz;
alter table public.custom_bets add column if not exists outcome_summary text;
alter table public.custom_bets add column if not exists outcome_submitted_by text;
alter table public.custom_bets add column if not exists custom_bet_type text check (custom_bet_type in ('standard', 'free_bet_offer'));
alter table public.custom_bets add column if not exists is_free_stake boolean;
alter table public.custom_bets add column if not exists placed_proposal_rank integer check (placed_proposal_rank in (1, 2, 3));
alter table public.custom_bets add column if not exists placed_market text;
alter table public.custom_bets add column if not exists placed_selection text;

grant select on public.custom_bets to authenticated;

alter table public.custom_bets enable row level security;

drop policy if exists "Authenticated users can read custom_bets" on public.custom_bets;
create policy "Authenticated users can read custom_bets"
on public.custom_bets
for select
to authenticated
using (true);

grant insert, update on public.custom_bets to authenticated;

drop policy if exists "Authenticated admins can insert custom_bets" on public.custom_bets;
create policy "Authenticated admins can insert custom_bets"
on public.custom_bets
for insert
to authenticated
with check (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');

drop policy if exists "Authenticated admins can update custom_bets" on public.custom_bets;
create policy "Authenticated admins can update custom_bets"
on public.custom_bets
for update
to authenticated
using (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin')
with check (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');
