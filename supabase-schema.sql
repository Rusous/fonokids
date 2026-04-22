create extension if not exists pgcrypto;

create table if not exists public.app_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  pacientes jsonb not null default '[]'::jsonb,
  sessions jsonb not null default '[]'::jsonb,
  actividades jsonb not null default '[]'::jsonb,
  compra_list jsonb not null default '[]'::jsonb,
  checked_mats jsonb not null default '{}'::jsonb,
  extra_mats jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.app_state
add column if not exists actividades jsonb not null default '[]'::jsonb;

alter table public.app_state enable row level security;

drop policy if exists "Users can view own app state" on public.app_state;
create policy "Users can view own app state"
on public.app_state
for select
using (auth.uid() = user_id);

drop policy if exists "Users can insert own app state" on public.app_state;
create policy "Users can insert own app state"
on public.app_state
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own app state" on public.app_state;
create policy "Users can update own app state"
on public.app_state
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create or replace function public.touch_app_state_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists app_state_set_updated_at on public.app_state;
create trigger app_state_set_updated_at
before update on public.app_state
for each row
execute function public.touch_app_state_updated_at();
