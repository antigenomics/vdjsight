-- noinspection SqlResolveForFile

# -- noinspection SqlDialectInspectionForFile

# --- !Ups

create table "analysis_cache"
(
    uuid             uuid         not null primary key,
    sample_file_id   uuid         not null,
    analysis         varchar(32)  not null,
    marker           varchar(255) not null,
    cache            text         not null,
    expired_at       timestamp    not null,
    last_accessed_at timestamp    not null,
    expired_action   text         not null,
    constraint sample_file_table_sample_id_fk foreign key (sample_file_id) references "sample_file" (uuid) on update cascade on delete restrict
);

create index analysis_cache_table_analysis_index on "analysis_cache" (analysis);
create index analysis_cache_table_marker_index on "analysis_cache" (marker);

# --- !Downs


drop index analysis_cache_table_marker_index;
drop index analysis_cache_table_analysis_index;
drop table "analysis_cache";
