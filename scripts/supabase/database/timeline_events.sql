create table if not exists public.timeline_events (
  id text not null,
  title text,
  description text,
  timestamp_iso timestamptz,
  kind text check (kind in ('matchday_proposal_generated')),
  matchday_id text,
  primary key (id),
  foreign key (matchday_id) references public.matchday_game_weeks (id)
);

grant select on public.timeline_events to authenticated;

alter table public.timeline_events enable row level security;

drop policy if exists "Authenticated users can read timeline_events" on public.timeline_events;
create policy "Authenticated users can read timeline_events"
on public.timeline_events
for select
to authenticated
using (true);
