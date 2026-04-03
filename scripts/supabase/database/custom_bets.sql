create table if not exists public.custom_bets (
  id text not null,
  slug text,
  title text,
  state text check (state in ('pending', 'staked')),
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
  stake_amount numeric(12, 2),
  placed_decimal_odds numeric(10, 2),
  placed_at_iso timestamptz,
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
