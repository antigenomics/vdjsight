-- noinspection SqlResolveForFile

# -- noinspection SqlDialectInspectionForFile

# --- !Ups

alter table "sample_file"
    add column species varchar(32) not null default 'undefined';
alter table "sample_file"
    alter column species drop default;

alter table "sample_file"
    add column gene varchar(16) not null default 'undefined';
alter table "sample_file"
    alter column gene drop default;

# --- !Downs

alter table "sample_file"
    drop column gene;

alter table "sample_file"
    drop column species;
