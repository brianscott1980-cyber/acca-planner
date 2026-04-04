-- Fix md-1 bet placed timestamp to yesterday at 23:34 Europe/London.
-- Updates simulation, slip, stake ledger entry, and league_data_meta.updated_at_iso.

begin;

with target as (
  select
    (
      (
        date_trunc('day', now() at time zone 'Europe/London')
        - interval '1 day'
      ) + time '23:34'
    ) at time zone 'Europe/London' as placed_at_utc
)
update public.league_data_matchday_simulations s
set bet_placed_at_iso = target.placed_at_utc
from target
where s.game_week_id = 'md-1';

with target as (
  select
    (
      (
        date_trunc('day', now() at time zone 'Europe/London')
        - interval '1 day'
      ) + time '23:34'
    ) at time zone 'Europe/London' as placed_at_utc
)
update public.league_data_slips sl
set
  stake_placed_at = target.placed_at_utc,
  settled_at = case
    when sl.settled_at is null then target.placed_at_utc + interval '7 day'
    when sl.settled_at < target.placed_at_utc then target.placed_at_utc + interval '7 day'
    else sl.settled_at
  end
from target
where sl.game_week_id = 'md-1';

with target as (
  select
    (
      (
        date_trunc('day', now() at time zone 'Europe/London')
        - interval '1 day'
      ) + time '23:34'
    ) at time zone 'Europe/London' as placed_at_utc
)
update public.ledger_transactions lt
set date_iso = target.placed_at_utc
from target
where lt.kind = 'stake'
  and lt.game_week_id = 'md-1';

update public.league_data_meta
set updated_at_iso = timezone('utc'::text, now())
where id = 'primary';

commit;

-- Optional verification:
-- select game_week_id, bet_placed_at_iso
-- from public.league_data_matchday_simulations
-- where game_week_id = 'md-1';
--
-- select game_week_id, stake_placed_at, settled_at
-- from public.league_data_slips
-- where game_week_id = 'md-1';
--
-- select id, title, date_iso, amount
-- from public.ledger_transactions
-- where kind = 'stake' and game_week_id = 'md-1'
-- order by updated_at desc nulls last, date_iso desc;
