-- noinspection SqlDialectInspectionForFile

# --- USER, PROJECT AND PROJECT_LINK schemas

# --- !Ups

create table "user"
(
    uuid     uuid         not null primary key,
    login    varchar(64)  not null unique,
    email    varchar(255) not null unique,
    verified boolean      not null,
    password varchar(255) not null
);

create table "project"
(
    uuid            uuid         not null primary key,
    name            varchar(255) not null,
    owner_id        uuid         not null,
    folder          varchar(510) not null unique,
    max_file_size   bigint       not null,
    max_files_count bigint       not null,
    foreign key (owner_id) references "user" (uuid) on update cascade on delete restrict
);

create index project_table_owner_index on "project" (owner_id);

create table "project_link"
(
    uuid                    uuid    not null primary key,
    project_id              uuid    not null,
    is_shared               boolean not null,
    is_upload_allowed       boolean not null,
    is_delete_allowed       boolean not null,
    is_modification_allowed boolean not null,
    foreign key (project_id) REFERENCES "project" (uuid) on update cascade on delete restrict
);

create index project_link_table_project_id_idx on "project_link" (project_id);

# --- !Downs

drop index project_link_table_project_id_idx;
drop table "project_link";

drop index project_table_owner_index;
drop table "project";

drop table "user";
