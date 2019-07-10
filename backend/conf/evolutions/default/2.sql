-- noinspection SqlDialectInspectionForFile

# --- !Ups

-- noinspection SqlResolve

create table "sample_file"
(
    uuid        uuid         not null primary key,
    owner_id    uuid         not null,
    name        varchar(255) not null,
    software    varchar(64)  not null,
    size        bigint       not null,
    hash        text         not null,
    folder      text         not null,
    is_uploaded boolean      not null,
    is_dangling boolean      not null,
    foreign key (owner_id) references "user" (uuid) on update cascade on delete restrict
);

create index sample_file_table_owner_id_idx on "sample_file" (owner_id);

-- noinspection SqlResolve

create table "sample_file_link"
(
    uuid       uuid not null primary key,
    sample_id  uuid not null,
    project_id uuid not null,
    delete_on  timestamp default null,
    foreign key (sample_id) references "sample_file" (uuid) on update cascade on delete restrict,
    foreign key (project_id) references "project" (uuid) on update cascade on delete restrict
);

create index sample_file_link_table_sample_id_idx on "sample_file_link" (sample_id);
create index sample_file_link_table_project_id_idx on "sample_file_link" (project_id);

# --- !Downs

drop index sample_file_link_table_project_id_idx;
drop index sample_file_link_table_sample_id_idx;
drop table "sample_file_link";

drop index SAMPLE_FILE_TABLE_OWNER_ID_IDX;
drop table "sample_file";
