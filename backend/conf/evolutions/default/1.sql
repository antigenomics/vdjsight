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

create table "user_permissions"
(
    uuid                       uuid   not null primary key,
    user_id                    uuid   not null unique,
    max_projects_count         bigint not null,
    max_samples_count          bigint not null,
    max_sample_size            bigint not null,
    max_dangling_project_links bigint not null,
    max_dangling_sample_links  bigint not null,
    constraint user_permissions_table_user_fk foreign key (user_id) references "user" (uuid) on update cascade on delete cascade
);

create index user_permissions_table_user_id_idx on "user_permissions" (user_id);

create table "project"
(
    uuid        uuid         not null primary key,
    name        varchar(255) not null,
    description text         not null,
    owner_id    uuid         not null,
    folder      text         not null,
    is_dangling boolean      not null,
    constraint project_table_owner_fk foreign key (owner_id) references "user" (uuid) on update cascade on delete restrict
);

create index project_table_owner_index on "project" (owner_id);

create table "project_link"
(
    uuid                    uuid    not null primary key,
    project_id              uuid    not null,
    user_id                 uuid    not null,
    is_shared               boolean not null,
    is_upload_allowed       boolean not null,
    is_delete_allowed       boolean not null,
    is_modification_allowed boolean not null,
    delete_on               timestamp default null,
    constraint project_link_table_project_fk foreign key (project_id) REFERENCES "project" (uuid) on update cascade on delete cascade,
    constraint project_link_table_user_fk foreign key (user_id) REFERENCES "user" (uuid) on update cascade on delete cascade
);

create index project_link_table_project_id_idx on "project_link" (project_id);
create index project_link_table_user_id_idx on "project_link" (user_id);

# --- !Downs

alter table "project_link"
    drop constraint project_link_table_project_fk;
alter table "project_link"
    drop constraint project_link_table_user_fk;
drop index project_link_table_user_id_idx;
drop index project_link_table_project_id_idx;
drop table "project_link";

alter table "project"
    drop constraint project_table_owner_fk;
drop index project_table_owner_index;
drop table "project";

alter table "user_permissions"
    drop constraint user_permissions_table_user_fk;
drop index user_permissions_table_user_id_idx;
drop table "user_permissions";

drop table "user";
