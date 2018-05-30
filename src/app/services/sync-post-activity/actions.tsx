enum SyncActions {
  ALL_ACTIONS = 0,

  COMMENT_ADD = 0x002,
  COMMENT_REMOVE = 0x003,
  LABEL_ADD = 0x011,
  LABEL_REMOVE = 0x012,
  EDITED = 0x015,
  PLACE_MOVE = 0x016,
  PLACE_ATTACH = 0x017,
};

export default SyncActions;
