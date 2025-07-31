-- Update conversations table sme_type constraint to match current SME types

-- First, update any existing invalid sme_type values to valid ones
UPDATE conversations 
SET sme_type = CASE 
  WHEN sme_type = 'science' THEN 'physics'
  WHEN sme_type = 'english' THEN 'literature'
  WHEN sme_type NOT IN ('math', 'physics', 'history', 'arts', 'programming', 'literature', 'languages', 'music', 'chatdoc') THEN 'math'
  ELSE sme_type
END;

-- Drop the old constraint
ALTER TABLE conversations 
DROP CONSTRAINT conversations_sme_type_check;

-- Add the new constraint with updated SME types
ALTER TABLE conversations 
ADD CONSTRAINT conversations_sme_type_check 
CHECK (sme_type IN (
  'math', 
  'physics', 
  'history', 
  'arts', 
  'programming', 
  'literature', 
  'languages', 
  'music', 
  'chatdoc'
));
