/*
  # Add automatic timestamp to sentiment_history

  1. Changes
    - Create a function to automatically add timestamps to sentiment_history entries
    - If a sentiment entry is missing a timestamp, it will be added automatically
    - Create a trigger to run this function before insert or update on leads table

  2. How it works
    - When sentiment_history is inserted or updated
    - The function checks each entry in the array
    - If timestamp is missing or null, it adds the current timestamp
    - This ensures all sentiment history entries have valid timestamps
*/

-- Create function to add timestamps to sentiment history entries
CREATE OR REPLACE FUNCTION add_sentiment_timestamps()
RETURNS TRIGGER AS $$
DECLARE
  updated_history jsonb;
  entry jsonb;
  new_entry jsonb;
BEGIN
  -- Initialize empty array
  updated_history := '[]'::jsonb;
  
  -- Loop through each sentiment history entry
  FOR entry IN SELECT * FROM jsonb_array_elements(NEW.sentiment_history)
  LOOP
    -- Check if timestamp is missing or null
    IF entry->>'timestamp' IS NULL OR entry->>'timestamp' = '' THEN
      -- Add current timestamp to the entry
      new_entry := jsonb_set(entry, '{timestamp}', to_jsonb(now()::text));
    ELSE
      new_entry := entry;
    END IF;
    
    -- Append to updated history
    updated_history := updated_history || jsonb_build_array(new_entry);
  END LOOP;
  
  -- Update the sentiment_history with timestamps added
  NEW.sentiment_history := updated_history;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically add timestamps
DROP TRIGGER IF EXISTS sentiment_timestamp_trigger ON leads;
CREATE TRIGGER sentiment_timestamp_trigger
  BEFORE INSERT OR UPDATE OF sentiment_history ON leads
  FOR EACH ROW
  EXECUTE FUNCTION add_sentiment_timestamps();