/** General Configurations Like PORT, HOST names and etc... */

var config = {
  env: process.env.NODE_ENV || 'development',
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || 8889,
  karmaPort: 9876,

  // This part goes to React-Helmet for Head of our HTML
  app: {
    head: {
      title: 'nested',
      titleTemplate: 'nested: %s',
      meta: [
        { charset: 'utf-8' },
        { name: 'theme-color', content: '#323D47' },
        { 'http-equiv': 'x-ua-compatible', content: 'ie=edge' },
        // { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'description', content: 'Nested' },
      ]
    }
  }
};

module.exports = config;
