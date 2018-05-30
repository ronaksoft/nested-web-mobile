enum SyncActions {
  ALL_ACTIONS = 0,

  MEMBER_REMOVE = 0x002,
  MEMBER_JOIN = 0x008,
  PLACE_ADD = 0x010,
  POST_ADD = 0x100,
  POST_REMOVE = 0x105,
  POST_MOVE_TO = 0x206,
  POST_MOVE_FROM = 0x207,
};

export default SyncActions;
