/*
  # Update team_size constraint to allow 0 and higher

  1. Changes
    - Drop the existing constraint on `leads.team_size` that requires team_size > 0
    - Add a new constraint that allows team_size >= 0 (0 or higher)

  2. Rationale
    - Some projects may not require any developers (team_size = 0)
    - The constraint should allow 0 and any positive integer
*/

DO $$
BEGIN
  -- Drop the old constraint if it exists
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'leads_team_size_check'
    AND table_name = 'leads'
  ) THEN
    ALTER TABLE leads DROP CONSTRAINT leads_team_size_check;
  END IF;
  
  -- Add the new constraint allowing 0 and higher
  ALTER TABLE leads ADD CONSTRAINT leads_team_size_check CHECK (team_size >= 0);
END $$;