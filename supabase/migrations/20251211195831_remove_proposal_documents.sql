/*
  # Remove proposal from documents

  1. Changes
    - Update default value for documents column to only include presentation
    - Remove proposal from all existing leads' documents arrays

  2. Details
    - Changes the default documents array from 2 items to 1 item
    - Only presentation document will be included going forward
    - Existing data is cleaned up to remove proposal entries
*/

-- Update the default value for new leads
ALTER TABLE leads 
ALTER COLUMN documents 
SET DEFAULT '[{"type": "presentation", "status": "generating", "url": null, "filename": "presentation.pdf"}]'::jsonb;

-- Remove proposal from existing leads
UPDATE leads
SET documents = (
  SELECT jsonb_agg(doc)
  FROM jsonb_array_elements(documents) AS doc
  WHERE doc->>'type' != 'proposal'
)
WHERE documents IS NOT NULL;
