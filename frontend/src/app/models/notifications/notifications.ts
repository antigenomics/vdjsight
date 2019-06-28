import { IncrementalGlobalUUID } from 'utils/uuid/incremental-global-uuid';

export const enum NotificationType {
  INFO    = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR   = 'error'
}

export const NotificationEntityDefaultTimeout = 5000;

export interface NotificationEntityOptions {
  type: NotificationType;
  timeout: number;
  closable: boolean;
  autoRemove: boolean;
}

export interface NotificationEntity {
  id: number;
  title: string;
  content: string;
  options: NotificationEntityOptions;
  scheduled: boolean;
  scheduledId?: number;
}

export function CreateNotificationEntity(title: string,
                                         content: string,
                                         opts?: Partial<NotificationEntityOptions>) {
  const options = {
    type:       opts.type !== undefined ? opts.type : NotificationType.INFO,
    timeout:    opts.timeout !== undefined ? opts.timeout : NotificationEntityDefaultTimeout,
    closable:   opts.closable !== undefined ? opts.closable : true,
    autoRemove: opts.autoRemove !== undefined ? opts.autoRemove : true
  };

  return {
    id:        IncrementalGlobalUUID.next(),
    title:     title,
    content:   content,
    options:   options,
    scheduled: false
  };
}

