-- This can be used to initialize the dev database, after flyway has been run.
INSERT INTO record (key, "offset", partition, replayed_offset, timestamp, topic, triaged, value)
VALUES ('key1', 1, 1, 1, 1, 'topic1', false, 'value1'),
       ('key2', 2, 2, 2, 2, 'topic2', false, 'value2'),
       ('key3', 3, 3, 3, 3, 'topic3', false, 'value3');

INSERT INTO header (key, value, native, record_id)
VALUES ('header_key1', 'header_value1', true, 1),
       ('header_key2', 'header_value2', true, 1),
       ('header_key3', 'header_value3', true, 1),
       ('header_key1', 'header_value1', true, 2),
       ('header_key2', 'header_value2', true, 2),
       ('header_key3', 'header_value3', true, 2),
       ('header_key1', 'header_value1', true, 3),
       ('header_key2', 'header_value2', true, 3),
       ('header_key3', 'header_value3', true, 3);
