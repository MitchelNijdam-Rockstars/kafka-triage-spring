create table if not exists record (
    id serial primary key,
    topic varchar(255) not null
);

-- TODO: figure out why flyway doesn't run this on startup