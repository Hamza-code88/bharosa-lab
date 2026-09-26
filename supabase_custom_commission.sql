-- ==========================================================
-- BHAROSA LAB - PER-LAB CUSTOM COMMISSION CUT MIGRATION
-- Run this script in Supabase SQL Editor (https://supabase.com/dashboard)
-- ==========================================================

-- Add commission_percentage to labs table (NULL means fallback to global app_settings)
ALTER TABLE labs 
ADD COLUMN IF NOT EXISTS commission_percentage NUMERIC DEFAULT NULL;

-- Comment explaining the column
COMMENT ON COLUMN labs.commission_percentage IS 'Custom negotiated commission percentage (0-100) for this lab. If NULL, system uses global rate from app_settings.';
