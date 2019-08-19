#!/bin/sh
# Dump DBs

if [[ -z "${POSTGRES_DB}" ]]; then
    POSTGRES_DB=db
fi

if [[ -z "${POSTGRES_USER}" ]]; then
    POSTGRES_USER=user
fi

echo "Database backup started"

now=$(date +"%d-%m-%Y_%H-%M")
pg_dump -U "${POSTGRES_USER}" -d "${POSTGRES_DB}" > "/pg_backups/db_dump_$now.sql"

# remove all files (type f) modified longer than 10 days ago under /pg_backups
find /pg_backups -name "*.sql" -type f -mtime +10 -delete

echo "Database backup finished"

exit 0
