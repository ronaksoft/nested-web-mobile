/* tslint:disable */
function generateConfig(): any {
  const windowObj: Window = window;
  if (!window.hasOwnProperty('__NESTED_CONFIG__')) {
    window.__NESTED_CONFIG__ = {
      APP_CLIENT_ID: 'WEBAPP_DEVELOPMENT',
      APP_VERSION: '4.4.4',
      DOMAIN: '_DOMAIN_',
      SIGN_OUT_TARGET: 'https://nested.me',
      WEBSOCKET: {
        URL: '_WS_CYRUS_CYRUS_URL_CONF_',
        TIMEOUT: 60000,
        REQUEST_MAX_RETRY_TIMES: 16,
      },
      STORE: {
        URL: '_XERXES_URL_CONF_',
        TOKEN_EXPMS: 3550000,
      },
      REGISTER: {
        AJAX: {
          URL: '_HTTP_CYRUS_URL_CONF_',
        },
      },
      GRAND_PLACE_REGEX: /^[a-zA-Z][a-zA-Z0-9-]{3,30}[a-zA-Z0-9]$/,
      GOOGLE_ANALYTICS_TOKEN: 'UA-92612481-1',
      UPLOAD_SIZE_LIMIT: 209715200,
    };
  }
  if (windowObj.__NESTED_CONFIG__.DOMAIN === '_DOMAIN_') {
    windowObj.__NESTED_CONFIG__.DOMAIN = 'demo.nested.me';
  }
  if (windowObj.__NESTED_CONFIG__.WEBSOCKET.URL.indexOf('://') === -1) {
    windowObj.__NESTED_CONFIG__.WEBSOCKET.URL = 'wss://20180800001.nested.me';
  }
  if (windowObj.__NESTED_CONFIG__.STORE.URL.indexOf('://') === -1) {
    windowObj.__NESTED_CONFIG__.STORE.URL = 'https://20180800001.nested.me/file';
  }
  if (windowObj.__NESTED_CONFIG__.REGISTER.AJAX.URL.indexOf('://') === -1) {
    windowObj.__NESTED_CONFIG__.REGISTER.AJAX.URL = 'https://20180800001.nested.me';
  }
  return {
    APP_CLIENT_ID: 'WEBAPP_DEVELOPMENT',
    APP_VERSION: '4.4.4',
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
    REGEX: {
      EMAIL: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
  };
}

/**
 * replace current end points with new configs
 *
 * @param {string} DOMAIN
 * @param {string} WEBSOCKET_URL cyrus web socket url
 * @param REGISTER_AJAX_URL   cyrus http url
 * @param {string} STORE_URL xerxes http url
 */
export function setNewConfig(DOMAIN: string, WEBSOCKET_URL: string, REGISTER_AJAX_URL, STORE_URL: string): void {
  const windowObj: Window = window;
  windowObj.__NESTED_CONFIG__.DOMAIN = DOMAIN;
  windowObj.__NESTED_CONFIG__.WEBSOCKET.URL = WEBSOCKET_URL;
  windowObj.__NESTED_CONFIG__.REGISTER.AJAX.URL = REGISTER_AJAX_URL;
  windowObj.__NESTED_CONFIG__.STORE.URL = STORE_URL;
}

export default generateConfig;
