-- noinspection SqlResolveForFile

# -- noinspection SqlDialectInspectionForFile

# --- !Ups

create table "verification_token"
(
    token      uuid      not null primary key,
    user_id    uuid      not null,
    expired_at timestamp not null,
    constraint verification_token_table_user_fk foreign key (user_id) references "user" (uuid) on update cascade on delete cascade
);

create table "reset_token"
(
    token      uuid      not null primary key,
    user_id    uuid      not null,
    expired_at timestamp not null,
    constraint reset_token_table_user_fk foreign key (user_id) references "user" (uuid) on update cascade on delete cascade
);

# --- !Downs

drop table "reset_token";

drop table "verification_token";
