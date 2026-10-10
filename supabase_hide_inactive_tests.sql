-- ==========================================================
-- BHAROSA LAB - HIDE INACTIVE LAB TESTS FROM MOBILE APP
-- Run this script in Supabase SQL Editor (https://supabase.com/dashboard)
-- ==========================================================

-- 1. Enable Row Level Security (RLS) on lab_tests
ALTER TABLE lab_tests ENABLE ROW LEVEL SECURITY;

-- 2. Drop any existing generic SELECT policies on lab_tests
DROP POLICY IF EXISTS "Public can view lab_tests" ON lab_tests;
DROP POLICY IF EXISTS "Allow public read on lab_tests" ON lab_tests;
DROP POLICY IF EXISTS "Public can view active lab tests" ON lab_tests;
DROP POLICY IF EXISTS "Anon can view active lab tests" ON lab_tests;
DROP POLICY IF EXISTS "Enable read access for all users" ON lab_tests;

-- 3. Policy: Public/Mobile App (anon key) can ONLY view tests of ACTIVE & VERIFIED labs
-- Is policy ki wajah se jab bhi koi lab Super Admin se OFF hogi,
-- mobile app ke test details page, search aur catalog se us lab ke tamam tests khud bakhud hide ho jayenge!
CREATE POLICY "Anon can view active lab tests" 
ON lab_tests
FOR SELECT
TO anon
USING (
    EXISTS (
        SELECT 1 FROM labs 
        WHERE labs.id = lab_tests.lab_id 
        AND labs.is_active = true 
        AND labs.is_verified = true
    )
);

-- 4. Policy: Authenticated users (Lab Owners, Staff members) have full access to manage their lab tests
DROP POLICY IF EXISTS "Authenticated users full access to lab_tests" ON lab_tests;
CREATE POLICY "Authenticated users full access to lab_tests" 
ON lab_tests
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
