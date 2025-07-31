-- Check current constraints (updated for newer PostgreSQL)
SELECT conname, pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conrelid = 'conversations'::regclass 
AND contype = 'c';

-- Remove any existing constraint completely
ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_sme_type_check;

-- Add the correct constraint that allows all current SME types
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
