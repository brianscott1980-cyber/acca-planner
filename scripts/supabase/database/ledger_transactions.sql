create table if not exists public.ledger_transactions (
  id text primary key,
  title text not null,
  date_iso timestamptz not null,
  amount numeric(12, 2) not null,
  kind text not null check (kind in ('deposit', 'stake', 'settlement')),
  game_week_id text,
  proposal_id text,
  custom_bet_id text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

alter table public.ledger_transactions add column if not exists custom_bet_id text;

grant select on public.ledger_transactions to authenticated;

alter table public.ledger_transactions enable row level security;

drop policy if exists "Authenticated users can read ledger transactions" on public.ledger_transactions;
create policy "Authenticated users can read ledger transactions"
on public.ledger_transactions
for select
to authenticated
using (true);

grant insert, update on public.ledger_transactions to authenticated;

drop policy if exists "Authenticated admins can insert ledger transactions" on public.ledger_transactions;
create policy "Authenticated admins can insert ledger transactions"
on public.ledger_transactions
for insert
to authenticated
with check (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');

drop policy if exists "Authenticated admins can update ledger transactions" on public.ledger_transactions;
create policy "Authenticated admins can update ledger transactions"
on public.ledger_transactions
for update
to authenticated
using (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin')
with check (coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin');

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'ledger_transactions'
  ) then
    alter publication supabase_realtime add table public.ledger_transactions;
  end if;
end
$$;
