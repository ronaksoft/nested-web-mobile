export default {
  APP_CLIENT_ID: 'WEBAPP_DEVELOPMENT',
  APP_VERSION: 353,
  DOMAIN: 'demo.nested.me',
  SIGN_OUT_TARGET: 'https://nested.me',
  WEBSOCKET: {
    URL: process.env.NST_WS_CYRUS_URL || 'wss://20180800001.nested.me',
    TIMEOUT: 60000,
    REQUEST_MAX_RETRY_TIMES: 16,
  },
  STORE: {
    URL: process.env.NST_XERXES_URL || 'https://20180800001.nested.me/file',
    TOKEN_EXPMS: 3550000,
  },
  REGISTER: {
    AJAX: {
      URL: process.env.NST_HTTP_CYRUS_URL || 'https://20180800001.nested.me',
    },
  },
  GRAND_PLACE_REGEX: /^[a-zA-Z][a-zA-Z0-9-]{3,30}[a-zA-Z0-9]$/,
  GOOGLE_ANALYTICS_TOKEN: 'UA-92612481-1',
  UPLOAD_SIZE_LIMIT: 209715200,
};
