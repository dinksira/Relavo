-- 1. Enable uuid-ossp extension
create extension if not exists "uuid-ossp";

-- 2. Create table: clients
create table if not exists clients (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  name text not null,
  contact_name text,
  email text,
  phone text,
  status text check (status in ('active', 'paused', 'churned')) default 'active',
  notes text,
  created_at timestamptz default now()
);

-- 3. Create table: health_scores
create table if not exists health_scores (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients on delete cascade,
  score integer check (score >= 0 and score <= 100),
  risk_level text check (risk_level in ('healthy', 'needs_attention', 'at_risk')),
  factors jsonb,
  ai_insight text,
  calculated_at timestamptz default now()
);

-- 4. Create table: touchpoints
create table if not exists touchpoints (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients on delete cascade,
  type text check (type in ('call', 'email', 'meeting', 'message')),
  notes text,
  outcome text check (outcome in ('positive', 'neutral', 'negative')),
  logged_at timestamptz default now(),
  created_at timestamptz default now()
);

-- 5. Create table: invoices
create table if not exists invoices (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients on delete cascade,
  amount numeric(10,2),
  status text check (status in ('pending', 'paid', 'overdue')) default 'pending',
  due_date date,
  paid_date date,
  created_at timestamptz default now()
);

-- 6. Create table: alerts
create table if not exists alerts (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients on delete cascade,
  type text check (type in ('no_contact', 'overdue_invoice', 'score_drop', 'sentiment')),
  severity text check (severity in ('low', 'medium', 'high')),
  message text not null,
  ai_suggestion text,
  read boolean default false,
  created_at timestamptz default now()
);

-- 7. Create table: profiles
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  company_name text,
  plan text default 'free',
  created_at timestamptz default now()
);

-- 8. Enable Row Level Security on ALL tables
alter table clients enable row level security;
alter table health_scores enable row level security;
alter table touchpoints enable row level security;
alter table invoices enable row level security;
alter table alerts enable row level security;
alter table profiles enable row level security;

-- 9. Create RLS policies
-- profiles
create policy "Users can only see their own profile" on profiles
  for all using (auth.uid() = id);

-- clients
create policy "Users can only see their own clients" on clients
  for all using (auth.uid() = user_id);

-- health_scores
create policy "Users can see health scores for their clients" on health_scores
  for all using (client_id in (select id from clients where user_id = auth.uid()));

-- touchpoints
create policy "Users can see touchpoints for their clients" on touchpoints
  for all using (client_id in (select id from clients where user_id = auth.uid()));

-- invoices
create policy "Users can see invoices for their clients" on invoices
  for all using (client_id in (select id from clients where user_id = auth.uid()));

-- alerts
create policy "Users can see alerts for their clients" on alerts
  for all using (client_id in (select id from clients where user_id = auth.uid()));
