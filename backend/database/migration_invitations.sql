-- ============================================================
-- RELAVO: Enhanced Invitation System
-- ============================================================

-- 1. Create team_invitations table
CREATE TABLE IF NOT EXISTS public.team_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID NOT NULL REFERENCES public.agencies(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('admin', 'member', 'viewer')),
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  token TEXT UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agency_id, email)
);

-- 2. Enable RLS
ALTER TABLE public.team_invitations ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Members can view invitations for their agency
CREATE POLICY "Members can view agency invitations" ON public.team_invitations
  FOR SELECT USING (
    agency_id IN (
      SELECT agency_id FROM public.agency_members
      WHERE user_id = auth.uid()
    )
  );

-- Only owners/admins can create/delete invitations
CREATE POLICY "Admins can manage invitations" ON public.team_invitations
  FOR ALL USING (
    agency_id IN (
      SELECT agency_id FROM public.agency_members
      WHERE user_id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Allow anyone to check a specific invitation by email (for onboarding check)
CREATE POLICY "Allow public check of invitations by email" ON public.team_invitations
  FOR SELECT USING (email = current_setting('jwt.claims.email', true));

-- 4. Indexing
CREATE INDEX IF NOT EXISTS idx_team_invitations_email ON public.team_invitations(email);
CREATE INDEX IF NOT EXISTS idx_team_invitations_token ON public.team_invitations(token);
