"use strict";
var appConfig = require('../config/main');
var e6p = require('es6-promise');
e6p.polyfill();
require('isomorphic-fetch');
var React = require('react');
var ReactDOMServer = require('react-dom/server');
var react_redux_1 = require('react-redux');
var react_router_1 = require('react-router');
var react_router_redux_1 = require('react-router-redux');
var _a = require('redux-connect'), ReduxAsyncConnect = _a.ReduxAsyncConnect, loadOnServer = _a.loadOnServer;
var store_1 = require('./app/redux/store');
var routes_1 = require('./app/routes');
var containers_1 = require('./app/containers');
var manifest = require('../build/manifest.json');
var express = require('express');
var path = require('path');
var compression = require('compression');
var Chalk = require('chalk');
var favicon = require('serve-favicon');
var app = express();
app.use(compression());
if (process.env.NODE_ENV !== 'production') {
    var webpack = require('webpack');
    var webpackConfig = require('../config/webpack/dev');
    var webpackCompiler = webpack(webpackConfig);
    app.use(require('webpack-dev-middleware')(webpackCompiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: { colors: true },
        noInfo: true,
        hot: true,
        inline: true,
        lazy: false,
        historyApiFallback: true,
        quiet: true
    }));
    app.use(require('webpack-hot-middleware')(webpackCompiler));
}
app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.get('*', function (req, res) {
    var location = req.url;
    var memoryHistory = react_router_1.createMemoryHistory(req.originalUrl);
    var store = store_1.configureStore(memoryHistory);
    var history = react_router_redux_1.syncHistoryWithStore(memoryHistory, store);
    react_router_1.match({ history: history, routes: routes_1["default"], location: location }, function (error, redirectLocation, renderProps) {
        if (error) {
            res.status(500).send(error.message);
        }
        else if (redirectLocation) {
            res.redirect(302, redirectLocation.pathname + redirectLocation.search);
        }
        else if (renderProps) {
            var asyncRenderData = Object.assign({}, renderProps, { store: store });
            loadOnServer(asyncRenderData).then(function () {
                var markup = ReactDOMServer.renderToString(<react_redux_1.Provider store={store} key="provider">
              <ReduxAsyncConnect {...renderProps}/>
            </react_redux_1.Provider>);
                res.status(200).send(renderHTML(markup, store));
            });
        }
        else {
            res.status(404).send('Not Found?');
        }
    });
});
app.listen(appConfig.port, appConfig.host, function (err) {
    if (err) {
        console.error(Chalk.bgRed(err));
    }
    else {
        console.info(Chalk.black.bgGreen("\n\n\uD83D\uDC82  Listening at http://" + appConfig.host + ":" + appConfig.port + "\n"));
    }
});
function renderHTML(markup, store) {
    var html = ReactDOMServer.renderToString(<containers_1.Html markup={markup} manifest={manifest} store={store}/>);
    return "<!doctype html> " + html;
}
//# sourceMappingURL=server.js.map