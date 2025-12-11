/*
  # Create leads table for customer call tracking

  1. New Tables
    - `leads`
      - `id` (uuid, primary key) - Unique identifier for each lead
      - `created_at` (timestamptz) - Timestamp of when the lead was created
      - `company_name` (text) - Name of the potential customer company
      - `project_name` (text) - Name of the potential project
      - `sentiment_score` (integer) - Score from 0-100 indicating likelihood of conversion (50 is neutral, 100 is very optimistic, 0 is unlikely)
      - `value` (text) - Potential value to company: low, medium, high, or unknown
      - `term` (text) - Project duration: short, medium, long, or unknown
      - `team_size` (integer) - Number of developers potentially needed
      - `status` (text) - Call status: live or ended
      - `user_id` (uuid) - Reference to the authenticated user who created the lead

  2. Security
    - Enable RLS on `leads` table
    - Add policy for authenticated users to read their own leads
    - Add policy for authenticated users to create their own leads
    - Add policy for authenticated users to update their own leads
    - Add policy for authenticated users to delete their own leads

  3. Indexes
    - Index on user_id for faster queries
    - Index on created_at for sorting
    - Index on status for filtering
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now() NOT NULL,
  company_name text NOT NULL,
  project_name text NOT NULL,
  sentiment_score integer DEFAULT 50 NOT NULL CHECK (sentiment_score >= 0 AND sentiment_score <= 100),
  value text DEFAULT 'unknown' NOT NULL CHECK (value IN ('low', 'medium', 'high', 'unknown')),
  term text DEFAULT 'unknown' NOT NULL CHECK (term IN ('short', 'medium', 'long', 'unknown')),
  team_size integer DEFAULT 1 NOT NULL CHECK (team_size > 0),
  status text DEFAULT 'live' NOT NULL CHECK (status IN ('live', 'ended')),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own leads"
  ON leads FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own leads"
  ON leads FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own leads"
  ON leads FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own leads"
  ON leads FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);