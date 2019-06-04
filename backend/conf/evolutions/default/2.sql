-- noinspection SqlDialectInspectionForFile

# --- USER, PROJECT AND PROJECT_LINK schemas

# --- !Ups

-- noinspection SqlResolve

CREATE TABLE "SAMPLE_FILE"
(
    UUID     UUID         NOT NULL PRIMARY KEY,
    OWNER_ID UUID         NOT NULL,
    NAME     VARCHAR(255) NOT NULL,
    SOFTWARE VARCHAR(64)  NOT NULL,
    FOREIGN KEY (OWNER_ID) REFERENCES "USER" (UUID) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX OWNER_ID_IDX on "SAMPLE_FILE" (OWNER_ID);

CREATE TABLE "SAMPLE_FILE_LINK"
(
    UUID            UUID         NOT NULL PRIMARY KEY,
    SAMPLE_ID       UUID         NOT NULL,
    FOREIGN KEY (SAMPLE_ID) REFERENCES "SAMPLE_FILE" (UUID) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE INDEX SAMPLE_ID_IDX on "SAMPLE_FILE_LINK" (SAMPLE_ID);

# --- !Downs

DROP INDEX SAMPLE_ID_IDX;
DROP TABLE "SAMPLE_FILE_LINK";

DROP INDEX OWNER_ID_IDX;
DROP TABLE "SAMPLE_FILE";