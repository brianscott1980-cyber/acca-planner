create table if not exists public.matchday_votes (
  game_week_id text not null,
  auth_user_id uuid not null references auth.users (id) on delete cascade,
  member_id text not null,
  proposal_id text not null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  primary key (game_week_id, auth_user_id),
  unique (game_week_id, member_id)
);

grant select, insert, update, delete on public.matchday_votes to authenticated;

alter table public.matchday_votes enable row level security;

drop policy if exists "Authenticated users can read matchday votes" on public.matchday_votes;
create policy "Authenticated users can read matchday votes"
on public.matchday_votes
for select
to authenticated
using (true);

drop policy if exists "Authenticated users can insert their own matchday vote" on public.matchday_votes;
create policy "Authenticated users can insert their own matchday vote"
on public.matchday_votes
for insert
to authenticated
with check (
  auth.uid() = auth_user_id
  and auth.uid() is not null
);

drop policy if exists "Authenticated users can update their own matchday vote" on public.matchday_votes;
create policy "Authenticated users can update their own matchday vote"
on public.matchday_votes
for update
to authenticated
using (auth.uid() = auth_user_id)
with check (
  auth.uid() = auth_user_id
  and auth.uid() is not null
);

drop policy if exists "Authenticated users can delete their own matchday vote" on public.matchday_votes;
create policy "Authenticated users can delete their own matchday vote"
on public.matchday_votes
for delete
to authenticated
using (auth.uid() = auth_user_id);

alter publication supabase_realtime add table public.matchday_votes;
