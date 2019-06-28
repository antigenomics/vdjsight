export const enum NotificationType {
  INFO    = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR   = 'error'
}

export interface NotificationEntity {
  id: number;
  type: NotificationType;
  title: string;
  content: string;
  timeout: number;
}
