-- ==========================================================
-- BHAROSA LAB (LAB-GHAR) - STAFF & MULTI-LAB SYSTEM MIGRATION
-- Run this script in Supabase SQL Editor (https://supabase.com/dashboard)
-- ==========================================================

-- 1. Add invite_code to labs table if it doesn't exist
ALTER TABLE labs 
ADD COLUMN IF NOT EXISTS invite_code TEXT UNIQUE;

-- Generate random 8-character invite codes for existing labs that don't have one
UPDATE labs 
SET invite_code = UPPER(SUBSTRING(MD5(RANDOM()::TEXT || id::TEXT) FROM 1 FOR 8))
WHERE invite_code IS NULL;

-- 2. Create lab_staff table to track team members
CREATE TABLE IF NOT EXISTS lab_staff (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    lab_id UUID NOT NULL REFERENCES labs(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- references auth.users(id)
    email TEXT NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'staff', -- 'staff', 'manager', 'technician'
    status TEXT DEFAULT 'active', -- 'active', 'revoked'
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT unique_lab_user UNIQUE (lab_id, user_id)
);

-- Index for fast lookup by user_id and lab_id
CREATE INDEX IF NOT EXISTS idx_lab_staff_user_id ON lab_staff(user_id);
CREATE INDEX IF NOT EXISTS idx_lab_staff_lab_id ON lab_staff(lab_id);
CREATE INDEX IF NOT EXISTS idx_labs_invite_code ON labs(invite_code);

-- 3. Enable Row Level Security (RLS) on lab_staff
ALTER TABLE lab_staff ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view staff records for labs they own or are a member of
CREATE POLICY "Allow users to read lab_staff" ON lab_staff
FOR SELECT TO authenticated
USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM labs WHERE labs.id = lab_staff.lab_id AND labs.owner_id = auth.uid())
);

-- Allow lab owners to insert/update/delete their staff
CREATE POLICY "Allow lab owners to manage lab_staff" ON lab_staff
FOR ALL TO authenticated
USING (
    EXISTS (SELECT 1 FROM labs WHERE labs.id = lab_staff.lab_id AND labs.owner_id = auth.uid())
)
WITH CHECK (
    EXISTS (SELECT 1 FROM labs WHERE labs.id = lab_staff.lab_id AND labs.owner_id = auth.uid())
);

-- Allow authenticated users to accept an invite (insert themselves)
CREATE POLICY "Allow users to self-insert on invite accept" ON lab_staff
FOR INSERT TO authenticated
WITH CHECK (
    user_id = auth.uid()
);
