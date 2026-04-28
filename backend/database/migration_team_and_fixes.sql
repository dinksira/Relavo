-- ============================================================
-- RELAVO: Team Collaboration Migration
-- ============================================================
-- This migration adds all missing tables and columns required
-- by the backend code but absent from the production database.
--
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- Ensure uuid-ossp is available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PART 1: Add missing columns to EXISTING tables
-- ============================================================

-- 1a. clients: add agency_id and monthly_revenue
ALTER TABLE public.clients
  ADD COLUMN IF NOT EXISTS agency_id UUID,
  ADD COLUMN IF NOT EXISTS monthly_revenue NUMERIC(12, 2) DEFAULT 0.00;

-- 1b. profiles: add agency_id and role
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS agency_id UUID,
  ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'owner';

-- 1c. touchpoints: add sentiment_score (used in ai.routes /send-draft)
ALTER TABLE public.touchpoints
  ADD COLUMN IF NOT EXISTS sentiment_score NUMERIC(3, 2);

-- ============================================================
-- PART 2: Create new TEAM COLLABORATION tables
-- ============================================================

-- 2a. agencies — Team workspaces
CREATE TABLE IF NOT EXISTS public.agencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  logo_url TEXT,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2b. agency_members — Team membership
CREATE TABLE IF NOT EXISTS public.agency_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member'
    CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agency_id, user_id)
);

-- 2c. activity_log — Shared team activity feed
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2d. comments — Client-level team comments
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  mentions JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PART 3: Add foreign key from clients.agency_id → agencies
-- ============================================================
-- (Only if it doesn't already exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'clients_agency_id_fkey'
      AND table_name = 'clients'
  ) THEN
    ALTER TABLE public.clients
      ADD CONSTRAINT clients_agency_id_fkey
      FOREIGN KEY (agency_id) REFERENCES public.agencies(id) ON DELETE SET NULL;
  END IF;
END $$;

-- Same for profiles.agency_id → agencies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'profiles_agency_id_fkey'
      AND table_name = 'profiles'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_agency_id_fkey
      FOREIGN KEY (agency_id) REFERENCES public.agencies(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================================
-- PART 4: Enable Row Level Security
-- ============================================================
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- PART 5: RLS Policies
-- ============================================================
-- IMPORTANT: The backend uses the Supabase SERVICE ROLE KEY which
-- bypasses RLS entirely. These policies only affect direct
-- frontend-to-Supabase queries (e.g., profile upserts in App.jsx).
--
-- The service_role always has full access — no policy needed for it.
-- These policies protect against anon/authenticated direct access.

-- agencies: members can read their own agency
-- We use a direct join or check to avoid recursion
CREATE POLICY "Agency members can view their agency" ON public.agencies
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.agency_members
      WHERE agency_id = public.agencies.id
      AND user_id = auth.uid()
    )
  );

-- agency_members: 
-- 1. Users can always see their own memberships
-- 2. Users can see co-members of agencies they belong to
CREATE POLICY "Users can view own membership" ON public.agency_members
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Members can view co-members" ON public.agency_members
  FOR SELECT USING (
    agency_id IN (
      SELECT am.agency_id FROM public.agency_members am
      WHERE am.user_id = auth.uid()
    )
  );

-- Allow users to insert their own membership (for team creation)
CREATE POLICY "Users can insert own membership" ON public.agency_members
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- activity_log: members can read their agency's activity
CREATE POLICY "Members can view agency activity" ON public.activity_log
  FOR SELECT USING (
    agency_id IN (
      SELECT agency_id FROM public.agency_members
      WHERE user_id = auth.uid()
    )
  );

-- Allow authenticated users to insert activity
CREATE POLICY "Authenticated users can insert activity" ON public.activity_log
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- comments: members can read comments in their agency
CREATE POLICY "Members can view agency comments" ON public.comments
  FOR SELECT USING (
    agency_id IN (
      SELECT agency_id FROM public.agency_members
      WHERE user_id = auth.uid()
    )
  );

-- Allow members to insert comments
CREATE POLICY "Members can add comments" ON public.comments
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- ============================================================
-- PART 6: Update existing RLS policies for agency-aware access
-- ============================================================
-- The existing clients RLS policy only allows user_id = auth.uid().
-- For team mode, we need to also allow agency members to see
-- shared clients. Drop the old policy and create a new one.

-- Drop the old clients policy (safe if it doesn't exist)
DROP POLICY IF EXISTS "Users can only see their own clients" ON public.clients;

-- New policy: users can see their own clients OR clients in their agency
CREATE POLICY "Users can see own or agency clients" ON public.clients
  FOR ALL USING (
    user_id = auth.uid()
    OR
    agency_id IN (
      SELECT agency_id FROM public.agency_members
      WHERE user_id = auth.uid()
    )
  );

-- ============================================================
-- PART 7: Indexes for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_agency_members_user_id ON public.agency_members(user_id);
CREATE INDEX IF NOT EXISTS idx_agency_members_agency_id ON public.agency_members(agency_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_agency_id ON public.activity_log(agency_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created_at ON public.activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_client_id ON public.comments(client_id);
CREATE INDEX IF NOT EXISTS idx_comments_agency_id ON public.comments(agency_id);
CREATE INDEX IF NOT EXISTS idx_clients_agency_id ON public.clients(agency_id);

-- ============================================================
-- DONE! Verify by running:
--   SELECT table_name FROM information_schema.tables
--   WHERE table_schema = 'public'
--   ORDER BY table_name;
-- ============================================================
