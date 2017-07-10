export default {
    APP_CLIENT_ID: 'WEBAPP_DEVELOPMENT',
    APP_VERSION: 353,
    DOMAIN: '_DOMAIN_',
    SIGN_OUT_TARGET: 'https://nested.me',
    WEBSOCKET: {
        URL: 'ws://cyrus.ronaksoftware.com:81',
        TIMEOUT: 60000,
        REQUEST_MAX_RETRY_TIMES: 16,
    },
    STORE: {
        URL: 'http://xerxes.ronaksoftware.com:83',
        TOKEN_EXPMS: 3550000,
    },
    REGISTER: {
        AJAX: {
            URL: 'http://cyrus.ronaksoftware.com:82',
        },
    },
    GRAND_PLACE_REGEX: /^[a-zA-Z][a-zA-Z0-9-]{3,30}[a-zA-Z0-9]$/,
    GOOGLE_ANALYTICS_TOKEN: 'UA-92612481-1',
    UPLOAD_SIZE_LIMIT: 209715200,
};
