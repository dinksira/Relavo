-- ============================================================
-- Relavo: Team Collaboration Migration
-- Non-disruptive — all changes are additive
-- ============================================================

-- 1. Create agencies table (The Team Workspace)
CREATE TABLE IF NOT EXISTS public.agencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create agency_members table (User ↔ Agency relationship)
CREATE TABLE IF NOT EXISTS public.agency_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member', 'viewer')),
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agency_id, user_id) -- Prevent duplicate memberships
);

-- 3. Create activity_log table (Shared Team Feed)
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'touchpoint_logged', 'client_added', 'score_drop', 'invoice_created', 'comment_added'
  entity_type TEXT, -- 'client', 'invoice', 'touchpoint', 'alert'
  entity_id UUID,
  metadata JSONB DEFAULT '{}', -- Flexible payload (client_name, score, etc.)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create comments table (Internal Team Discussions on Clients)
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  mentions UUID[] DEFAULT '{}', -- Array of mentioned user_ids
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Add agency_id to clients (nullable — backward compatible)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'clients' AND column_name = 'agency_id'
  ) THEN
    ALTER TABLE public.clients 
      ADD COLUMN agency_id UUID REFERENCES public.agencies(id) ON DELETE SET NULL;
  END IF;
END $$;

-- 6. Add agency_id + role to profiles (nullable — backward compatible)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'agency_id'
  ) THEN
    ALTER TABLE public.profiles 
      ADD COLUMN agency_id UUID REFERENCES public.agencies(id) ON DELETE SET NULL;
    ALTER TABLE public.profiles 
      ADD COLUMN role TEXT DEFAULT 'owner';
  END IF;
END $$;

-- ============================================================
-- Row Level Security
-- ============================================================
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agency_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Agencies: Members can view their agency
CREATE POLICY "Agency members can view their agency" ON public.agencies
  FOR SELECT USING (
    id IN (SELECT agency_id FROM public.agency_members WHERE user_id = auth.uid())
  );

-- Agencies: Only owner can update
CREATE POLICY "Agency owner can update" ON public.agencies
  FOR UPDATE USING (owner_id = auth.uid());

-- Agencies: Any authenticated user can create
CREATE POLICY "Authenticated users can create agencies" ON public.agencies
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Agency Members: Members can view fellow members
CREATE POLICY "Members can view team" ON public.agency_members
  FOR SELECT USING (
    agency_id IN (SELECT agency_id FROM public.agency_members WHERE user_id = auth.uid())
  );

-- Agency Members: Admins/owners can manage
CREATE POLICY "Admins can manage members" ON public.agency_members
  FOR ALL USING (
    agency_id IN (
      SELECT agency_id FROM public.agency_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Activity Log: Team members can view
CREATE POLICY "Team members can view activity" ON public.activity_log
  FOR SELECT USING (
    agency_id IN (SELECT agency_id FROM public.agency_members WHERE user_id = auth.uid())
  );

-- Activity Log: Any member can insert
CREATE POLICY "Members can log activity" ON public.activity_log
  FOR INSERT WITH CHECK (
    agency_id IN (SELECT agency_id FROM public.agency_members WHERE user_id = auth.uid())
  );

-- Comments: Team members can view
CREATE POLICY "Team can view comments" ON public.comments
  FOR SELECT USING (
    agency_id IN (SELECT agency_id FROM public.agency_members WHERE user_id = auth.uid())
  );

-- Comments: Members can create
CREATE POLICY "Members can comment" ON public.comments
  FOR INSERT WITH CHECK (
    agency_id IN (SELECT agency_id FROM public.agency_members WHERE user_id = auth.uid())
  );

-- Comments: Author can edit/delete own comments
CREATE POLICY "Authors can edit own comments" ON public.comments
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Authors can delete own comments" ON public.comments
  FOR DELETE USING (user_id = auth.uid());

-- ============================================================
-- Updated Client Policy (Inclusive OR — The "Sidecar" Pattern)
-- ============================================================
-- Drop existing policy first (if it exists)
DROP POLICY IF EXISTS "Users can only see their own clients" ON public.clients;

-- New inclusive policy: personal access OR team access
CREATE POLICY "Users can access own or team clients" ON public.clients
  FOR ALL USING (
    auth.uid() = user_id  -- Existing personal access (unchanged behavior)
    OR 
    agency_id IN (SELECT agency_id FROM public.agency_members WHERE user_id = auth.uid())  -- Team access
  );

-- ============================================================
-- Similarly update child-table policies
-- ============================================================
DROP POLICY IF EXISTS "Users can see health scores for their clients" ON public.health_scores;
CREATE POLICY "Users can see health scores for their clients" ON public.health_scores
  FOR ALL USING (
    client_id IN (
      SELECT id FROM public.clients 
      WHERE user_id = auth.uid() 
        OR agency_id IN (SELECT agency_id FROM public.agency_members WHERE user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can see touchpoints for their clients" ON public.touchpoints;
CREATE POLICY "Users can see touchpoints for their clients" ON public.touchpoints
  FOR ALL USING (
    client_id IN (
      SELECT id FROM public.clients 
      WHERE user_id = auth.uid() 
        OR agency_id IN (SELECT agency_id FROM public.agency_members WHERE user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can see invoices for their clients" ON public.invoices;
CREATE POLICY "Users can see invoices for their clients" ON public.invoices
  FOR ALL USING (
    client_id IN (
      SELECT id FROM public.clients 
      WHERE user_id = auth.uid() 
        OR agency_id IN (SELECT agency_id FROM public.agency_members WHERE user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can see alerts for their clients" ON public.alerts;
CREATE POLICY "Users can see alerts for their clients" ON public.alerts
  FOR ALL USING (
    client_id IN (
      SELECT id FROM public.clients 
      WHERE user_id = auth.uid() 
        OR agency_id IN (SELECT agency_id FROM public.agency_members WHERE user_id = auth.uid())
    )
  );

-- ============================================================
-- Indexes for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_agency_members_user ON public.agency_members(user_id);
CREATE INDEX IF NOT EXISTS idx_agency_members_agency ON public.agency_members(agency_id);
CREATE INDEX IF NOT EXISTS idx_clients_agency ON public.clients(agency_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_agency ON public.activity_log(agency_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_client ON public.comments(client_id, created_at DESC);
