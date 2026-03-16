-- Relavo Database Schema (PostgreSQL / Supabase)

-- 1. Agencies (Main Workspace)
CREATE TABLE IF NOT EXISTS public.agencies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    owner_email TEXT UNIQUE NOT NULL,
    branding JSONB DEFAULT '{"primary_color": "#0066FF", "logo_url": null}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Clients (Individual Accounts)
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agency_id UUID REFERENCES public.agencies(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    email TEXT,
    vitality_score INTEGER DEFAULT 100 CHECK (vitality_score BETWEEN 0 AND 100),
    status TEXT DEFAULT 'Healthy' CHECK (status IN ('Healthy', 'Needs Attention', 'At Risk')),
    score_trend INTEGER DEFAULT 0,
    monthly_revenue DECIMAL(12, 2) DEFAULT 0.00,
    initials VARCHAR(4),
    last_contact_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Alerts (AI Smart Signals)
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    severity TEXT DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
    is_active BOOLEAN DEFAULT TRUE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Invoices (Financial Pulse)
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    invoice_number TEXT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    due_date DATE NOT NULL,
    status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Paid', 'Overdue', 'Cancelled')),
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Touchpoints (Communication History)
CREATE TABLE IF NOT EXISTS public.touchpoints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'email', 'call', 'meeting', 'message'
    date TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    sentiment_score DECIMAL(3, 2), -- 0.0 to 1.0
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.touchpoints ENABLE ROW LEVEL SECURITY;

-- Basic Security Policies (Placeholder - To be refined with Supabase Auth)
-- For now, allow all operations for development (UNSAFE for production)
-- CREATE POLICY "Agencies are private" ON public.agencies FOR ALL USING (true);
-- CREATE POLICY "Clients belong to agency" ON public.clients FOR ALL USING (true);
-- etc...
