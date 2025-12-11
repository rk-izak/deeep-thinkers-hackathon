/*
  # Create messages table for voice bot conversations

  1. New Tables
    - `messages`
      - `id` (uuid, primary key) - Unique identifier for the message
      - `lead_id` (uuid, foreign key) - References the lead this message belongs to
      - `role` (text) - Either 'user' or 'agent' to identify who sent the message
      - `text` (text) - The actual message content
      - `created_at` (timestamptz) - When the message was created
  
  2. Security
    - Enable RLS on `messages` table
    - Add policy to allow anyone to read messages (since leads are public)
    - Add policy to allow anyone to insert messages (since leads are public)
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'agent')),
  text text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read messages"
  ON messages
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert messages"
  ON messages
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_messages_lead_id ON messages(lead_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);