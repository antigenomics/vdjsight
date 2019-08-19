FROM postgres:11.5-alpine

RUN mkdir /pg_backups
ADD ./backup.sh /etc/periodic/daily/backup
RUN chmod +x /etc/periodic/daily/backup
