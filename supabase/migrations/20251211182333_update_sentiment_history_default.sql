/*
  # Update sentiment history default value

  1. Changes
    - Update the default value for sentiment_history to include an initial entry
    - The initial entry will have score 50 and reason "Initial sentiment"
    - This ensures all new leads start with a sentiment history point
*/

-- Update the default value for sentiment_history column
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'sentiment_history'
  ) THEN
    ALTER TABLE leads ALTER COLUMN sentiment_history SET DEFAULT '[{"timestamp": "now()", "score": 50, "reason": "Initial sentiment"}]'::jsonb;
  END IF;
END $$;
