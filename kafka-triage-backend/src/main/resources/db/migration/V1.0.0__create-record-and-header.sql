create table if not exists record
(
    id              bigserial primary key not null,
    key             varchar(128),
    "offset"        int8               not null,
    partition       int4               not null,
    replayed_offset int8,
    timestamp       int8               not null,
    topic           varchar(128)       not null,
    triaged         boolean            not null,
    value           text,
    constraint unique_record unique (topic, partition, "offset")
);

create table if not exists header
(
    id        bigserial primary key not null,
    key       varchar(128),
    value     text,
    native    boolean,
    record_id int8               not null,
    constraint fk_record foreign key (record_id) references record (id) on delete cascade
);

create index if not exists record_triaged on record (triaged);
create index if not exists header_record_id on header (record_id);