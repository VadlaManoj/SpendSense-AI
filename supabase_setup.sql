-- 1. Create the `audits` table
CREATE TABLE audits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  data jsonb NOT NULL,
  savings_calculated numeric,
  summary text
);

-- 2. Create the `leads` table
CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  email text NOT NULL,
  audit_id uuid REFERENCES audits(id) ON DELETE CASCADE
);

-- 3. Set up Row Level Security (RLS)
-- Enable RLS on both tables
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts to audits
CREATE POLICY "Allow anonymous inserts to audits"
ON audits
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow anonymous selects to audits (so users can view their results later)
CREATE POLICY "Allow anonymous selects on audits"
ON audits
FOR SELECT
TO anon
USING (true);

-- Allow anonymous inserts to leads
CREATE POLICY "Allow anonymous inserts to leads"
ON leads
FOR INSERT
TO anon
WITH CHECK (true);
