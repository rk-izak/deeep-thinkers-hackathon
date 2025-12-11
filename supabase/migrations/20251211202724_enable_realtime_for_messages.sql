/*
  # Enable Real-time for Messages Table

  1. Changes
    - Add messages table to supabase_realtime publication
    - This enables real-time subscriptions for the messages table
    - Allows clients to receive live updates when messages are inserted, updated, or deleted
  
  2. Impact
    - Real-time updates will work for the messages table
    - The LeadDetails component will receive live transcript updates
    - No impact on existing data or table structure
*/

-- Enable realtime for messages table
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
