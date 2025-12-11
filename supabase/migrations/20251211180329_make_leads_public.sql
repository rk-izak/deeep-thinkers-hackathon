/*
  # Make leads table publicly accessible

  1. Changes
    - Make user_id column nullable (allow anonymous leads)
    - Drop existing restrictive RLS policies for authenticated users
    - Add new public policies that allow anyone to read, create, update, and delete leads
  
  2. Security
    - This makes the leads table completely public
    - Anyone can view, create, update, or delete any lead without authentication
    - The user_id field becomes optional and can be null
*/

-- Make user_id nullable
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'user_id' AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE leads ALTER COLUMN user_id DROP NOT NULL;
  END IF;
END $$;

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own leads" ON leads;
DROP POLICY IF EXISTS "Users can create own leads" ON leads;
DROP POLICY IF EXISTS "Users can update own leads" ON leads;
DROP POLICY IF EXISTS "Users can delete own leads" ON leads;

-- Create public policies that allow anyone to access leads
CREATE POLICY "Anyone can view all leads"
  ON leads FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create leads"
  ON leads FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update any lead"
  ON leads FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can delete any lead"
  ON leads FOR DELETE
  TO public
  USING (true);
