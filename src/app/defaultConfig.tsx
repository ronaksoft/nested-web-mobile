export default {
  APP_CLIENT_ID: 'WEBAPP_DEVELOPMENT',
  APP_VERSION: 353,
  DOMAIN: '_DOMAIN_',
  SIGN_OUT_TARGET: 'https://nested.me',
  WEBSOCKET: {
    URL: process.env.NST_WS_CYRUS_URL || 'wss://cyrus.nested.me:443',
    TIMEOUT: 60000,
    REQUEST_MAX_RETRY_TIMES: 16,
  },
  STORE: {
    URL: process.env.NST_XERXES_URL || 'https://xerxes.nested.me',
    TOKEN_EXPMS: 3550000,
  },
  REGISTER: {
    AJAX: {
      URL: process.env.NST_HTTP_CYRUS_URL || 'https://cyrus.nested.me:444',
    },
  },
  GRAND_PLACE_REGEX: /^[a-zA-Z][a-zA-Z0-9-]{3,30}[a-zA-Z0-9]$/,
  GOOGLE_ANALYTICS_TOKEN: 'UA-92612481-1',
  UPLOAD_SIZE_LIMIT: 209715200,
};
