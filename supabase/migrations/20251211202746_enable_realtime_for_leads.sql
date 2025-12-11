/*
  # Enable Real-time for Leads Table

  1. Changes
    - Add leads table to supabase_realtime publication
    - This enables real-time subscriptions for the leads table
    - Allows clients to receive live updates when leads are inserted, updated, or deleted
  
  2. Impact
    - Real-time updates will work for the leads table
    - The Dashboard and LeadDetails components will receive live updates
    - No impact on existing data or table structure
*/

-- Enable realtime for leads table
ALTER PUBLICATION supabase_realtime ADD TABLE leads;
