export default {
  // Post
  NOTIFICATION_SUBJECT_POST: 0x01,
  MENTION: 0x001,
  COMMENT: 0x002,
  INVITE: 0x003,
  INVITE_RESPOND: 0x004,
  YOU_JOINED: 0x005,
  PROMOTED: 0x006,
  DEMOTED: 0x007,
  PLACE_SETTINGS_CHANGED :  0x008,
  FRIEND_JOINED: 0x010,
  TASK_OVERDUE: 0x100,
  TASK_NOT_ASSIGNED: 0x200,
  NEW_SESSION : 0x009,
  LABEL_REQUEST_APPROVED: 0x011,
  LABEL_REQUEST_REJECTED: 0x012,
  LABEL_REQUEST_CREATED: 0x013,
  LABEL_JOINED: 0x014,

  // Task
  NOTIFICATION_SUBJECT_TASK: 0x02,
  TASK_MENTION: 0x101,
  TASK_COMMENT: 0x102,
  TASK_ASSIGNED: 0x103,
  TASK_ASSIGNEE_CHANGED: 0x104,
  TASK_ADD_TO_CANDIDATES: 0x105,
  TASK_ADD_TO_WATCHERS: 0x106,
  TASK_DUE_TIME_UPDATED: 0x107,
  TASK_OVER_DUE: 0x108,
  TASK_TITLE_UPDATED: 0x109,
  TASK_UPDATED: 0x110,
  TASK_REJECTED: 0x111,
  TASK_ACCEPTED: 0x112,
  TASK_COMPLETED: 0x113,
  TASK_HOLD: 0x114,
  TASK_IN_PROGRESS: 0x115,
};
