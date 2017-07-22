function generateConfig(): any {
  const windowObj: Window = window;
  return {
    APP_CLIENT_ID: 'WEBAPP_DEVELOPMENT',
    APP_VERSION: 353,
    DOMAIN: windowObj.__NESTED_CONFIG__.DOMAIN,
    SIGN_OUT_TARGET: '/',
    WEBSOCKET: {
      URL: windowObj.__NESTED_CONFIG__.WEBSOCKET.URL,
      TIMEOUT: 60000,
      REQUEST_MAX_RETRY_TIMES: 16,
    },
    STORE: {
      URL: windowObj.__NESTED_CONFIG__.STORE.URL,
      TOKEN_EXPMS: 3550000,
    },
    REGISTER: {
      AJAX: {
        URL: windowObj.__NESTED_CONFIG__.REGISTER.AJAX.URL,
      },
    },
    GRAND_PLACE_REGEX: /^[a-zA-Z][a-zA-Z0-9-]{3,30}[a-zA-Z0-9]$/,
    GOOGLE_ANALYTICS_TOKEN: 'UA-92612481-1',
    UPLOAD_SIZE_LIMIT: 209715200,
  };
}

export default generateConfig;
