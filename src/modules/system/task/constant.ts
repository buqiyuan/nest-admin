export enum TaskStatus {
  Disabled = 0,
  Activited = 1,
}

export enum TaskType {
  Cron = 0,
  Interval = 1,
}

export const SYS_TASK_QUEUE_NAME = 'system:sys-task';
export const SYS_TASK_QUEUE_PREFIX = 'system:sys:task';
