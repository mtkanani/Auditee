-- One-time SQL migration to normalize email records to lowercase
-- Ensures exact B-tree unique index matches with zero case discrepancy

BEGIN;

UPDATE users 
SET email = LOWER(TRIM(email)) 
WHERE email != LOWER(TRIM(email));

UPDATE clients 
SET email = LOWER(TRIM(email)) 
WHERE email != LOWER(TRIM(email));

COMMIT;
