-- This can be used to clean the dev database.
DELETE FROM header;
DELETE FROM record;

ALTER SEQUENCE record_id_seq RESTART WITH 1;
ALTER SEQUENCE header_id_seq RESTART WITH 1;
