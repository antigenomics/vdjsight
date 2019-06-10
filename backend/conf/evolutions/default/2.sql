-- noinspection SqlDialectInspectionForFile

# --- !Ups

-- noinspection SqlResolve

create table "sample_file"
(
    uuid     uuid         not null primary key,
    owner_id uuid         not null,
    name     varchar(255) not null,
    software varchar(64)  not null,
    foreign key (owner_id) references "user" (uuid) on update cascade on delete restrict
);

create index sample_file_table_owner_id_idx on "sample_file" (owner_id);

create table "sample_file_link"
(
    uuid      uuid not null primary key,
    sample_id uuid not null,
    foreign key (sample_id) references "sample_file" (uuid) on update cascade on delete restrict
);

create index sample_file_link_table_sample_id_idx on "sample_file_link" (sample_id);

# --- !Downs

drop index sample_file_link_table_sample_id_idx;
drop table "sample_file_link";

drop index SAMPLE_FILE_TABLE_OWNER_ID_IDX;
drop table "sample_file";
