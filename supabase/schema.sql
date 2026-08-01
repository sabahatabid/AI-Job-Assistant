-- ============================================================
-- CareerPilot AI — Supabase Database Schema
-- Run this in the Supabase SQL editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ============================================================

-- Profiles table (extends auth.users)
create table if not exists public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text,
  avatar_url    text,
  resume_score  integer default 0 check (resume_score >= 0 and resume_score <= 100),
  applications_count integer default 0,
  interviews_count   integer default 0,
  offers_count       integer default 0,
  completion_pct     integer default 0 check (completion_pct >= 0 and completion_pct <= 100),
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

-- Agent runs table (stores all AI agent executions)
create table if not exists public.agent_runs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade,
  agent       text not null,
  prompt      text not null,
  response    text,
  model       text,
  created_at  timestamptz default now()
);

-- Row-level security
alter table public.profiles enable row level security;
alter table public.agent_runs enable row level security;

-- Profiles: users can only read/write their own row
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can upsert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Agent runs: users can only read/write their own rows
create policy "Users can view their own agent runs"
  on public.agent_runs for select
  using (auth.uid() = user_id);

create policy "Users can insert their own agent runs"
  on public.agent_runs for insert
  with check (auth.uid() = user_id or user_id is null);

-- Auto-create profile on new user sign-up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if it exists (idempotent)
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
