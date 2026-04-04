create table if not exists public.custom_bet_outcomes (
  id text primary key,
  custom_bet_id text not null,
  outcome_status text not null check (outcome_status in ('won', 'lost', 'cashed_out')),
  outcome_value_amount numeric(12, 2),
  outcome_at_iso timestamptz not null,
  summary text not null,
  submitted_by text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  foreign key (custom_bet_id) references public.custom_bets (id)
);

grant select on public.custom_bet_outcomes to authenticated;
grant insert, update on public.custom_bet_outcomes to authenticated;

alter table public.custom_bet_outcomes enable row level security;

drop policy if exists "Authenticated users can read custom bet outcomes" on public.custom_bet_outcomes;
create policy "Authenticated users can read custom bet outcomes"
on public.custom_bet_outcomes
for select
to authenticated
using (true);

drop policy if exists "Authenticated admins can write custom bet outcomes" on public.custom_bet_outcomes;
create policy "Authenticated admins can write custom bet outcomes"
on public.custom_bet_outcomes
for all
to authenticated
using (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin')
with check (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');
