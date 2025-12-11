/*
  # Add lead details fields

  1. New Columns
    - `sentiment_history` (jsonb) - Array of sentiment changes with timestamps and reasons
      Structure: [{ timestamp: string, score: number, reason: string }]
    - `project_summary` (text) - AI-generated summary of the project
    - `important_notes` (text) - Important notes about the lead
    - `transcript` (text) - Full transcript of the call
    - `documents` (jsonb) - Array of documents with status and URLs
      Structure: [{ type: 'presentation' | 'proposal', status: 'generating' | 'ready', url: string | null, filename: string }]
    - `contact_name` (text) - Name of the contact person
    - `contact_email` (text) - Email of the contact person
    - `contact_phone` (text) - Phone number of the contact person

  2. Default Values
    - sentiment_history defaults to empty array
    - documents defaults to array with presentation and proposal in generating state
    - Other fields default to empty string or null
*/

-- Add new columns to leads table
DO $$
BEGIN
  -- Add sentiment_history column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'sentiment_history'
  ) THEN
    ALTER TABLE leads ADD COLUMN sentiment_history jsonb DEFAULT '[]'::jsonb NOT NULL;
  END IF;

  -- Add project_summary column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'project_summary'
  ) THEN
    ALTER TABLE leads ADD COLUMN project_summary text DEFAULT '' NOT NULL;
  END IF;

  -- Add important_notes column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'important_notes'
  ) THEN
    ALTER TABLE leads ADD COLUMN important_notes text DEFAULT '' NOT NULL;
  END IF;

  -- Add transcript column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'transcript'
  ) THEN
    ALTER TABLE leads ADD COLUMN transcript text DEFAULT '' NOT NULL;
  END IF;

  -- Add documents column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'documents'
  ) THEN
    ALTER TABLE leads ADD COLUMN documents jsonb DEFAULT '[
      {"type": "presentation", "status": "generating", "url": null, "filename": "presentation.pdf"},
      {"type": "proposal", "status": "generating", "url": null, "filename": "proposal.pdf"}
    ]'::jsonb NOT NULL;
  END IF;

  -- Add contact_name column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'contact_name'
  ) THEN
    ALTER TABLE leads ADD COLUMN contact_name text DEFAULT '' NOT NULL;
  END IF;

  -- Add contact_email column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'contact_email'
  ) THEN
    ALTER TABLE leads ADD COLUMN contact_email text DEFAULT '' NOT NULL;
  END IF;

  -- Add contact_phone column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'leads' AND column_name = 'contact_phone'
  ) THEN
    ALTER TABLE leads ADD COLUMN contact_phone text DEFAULT '' NOT NULL;
  END IF;
END $$;
