const appConfig = require('../config/main');

import * as e6p from 'es6-promise';
(e6p as any).polyfill();
import 'isomorphic-fetch';

// import * as React from 'react';
// import * as ReactDOMServer from 'react-dom/server';

// import { Provider } from 'react-redux';
// import { createMemoryHistory, match } from 'react-router';
// import { syncHistoryWithStore } from 'react-router-redux';
// const { ReduxAsyncConnect, loadOnServer } = require('redux-connect');
// import { configureStore } from './app/redux/store';
// import routes from './app/routes';

// import { Html } from './app/containers';
// const manifest = require('../build/manifest.json');

const express = require('express');
const path = require('path');
const compression = require('compression');
const Chalk = require('chalk');
const favicon = require('serve-favicon');

const app = express();

app.use(compression());

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const webpackConfig = require('../config/webpack/dev');
  const webpackCompiler = webpack(webpackConfig);

  app.use(require('webpack-dev-middleware')(webpackCompiler, {
    publicPath: webpackConfig.output.publicPath,
    stats: { colors: true },
    noInfo: true,
    hot: true,
    inline: true,
    lazy: false,
    historyApiFallback: true,
    quiet: true,
  }));

  app.use(require('webpack-hot-middleware')(webpackCompiler));
}

app.use(favicon(path.join(__dirname, 'public/favicon.ico')));

app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('*', (res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(appConfig.port, appConfig.host, (err) => {
  if (err) {
    console.error(Chalk.bgRed(err));
  } else {
    console.info(Chalk.black.bgGreen(
      `\n\n💂  Listening at http://${appConfig.host}:${appConfig.port}\n`,
    ));
  }
});

// function renderHTML(markup: string, store: any) {
//   const html = ReactDOMServer.renderToString(
//     <Html markup={markup} manifest={manifest} store={store} />,
//   );

//   return `<!doctype html> ${html}`;
// }
