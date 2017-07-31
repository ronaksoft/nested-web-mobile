# Nested
[![Build Status](https://travis-ci.org/barbar/vortigern.svg?branch=master)](https://travis-ci.org/barbar/vortigern)
[![Dependency Status](https://david-dm.org/barbar/vortigern.svg)]()
[![devDependency Status](https://david-dm.org/barbar/vortigern/dev-status.svg)]()
[![Code Climate](https://codeclimate.com/github/barbar/vortigern/badges/gpa.svg)](https://codeclimate.com/github/barbar/vortigern)
[![GitHub issues](https://img.shields.io/github/issues/barbar/vortigern.svg)](https://github.com/barbar/vortigern/issues)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/barbar/vortigern/develop/LICENSE)
___

<img src="http://nested.me/wp-content/uploads/2017/07/GrandPlace-Posts@2x.png" width="320" height="568"/>

**Nested Mobile App** This is mobile client for Nested application

[![TypeScript](https://barbaruploads.s3.amazonaws.com/bicoz/typescript.png)](https://www.typescriptlang.org/) 
[![React](https://barbaruploads.s3.amazonaws.com/bicoz/react.png)](https://github.com/facebook/react) 
[![Redux](https://barbaruploads.s3.amazonaws.com/bicoz/redux.png)](https://github.com/reactjs/redux)


## Libraries
App uses the following libraries and tools:

#### Core
- [TypeScript](https://www.typescriptlang.org/)
- [React](https://github.com/facebook/react) & [React DOM](https://github.com/facebook/react) for views.
- [React Router](https://github.com/reactjs/react-router) to handle in-app routing.
- [Redux](https://github.com/reactjs/redux) for managing application state.
- [React-Redux](https://github.com/reactjs/react-redux) to use React-Redux bindings.
- [React-Router-Redux](https://github.com/reactjs/react-router-redux) to keep application state sync with route changes.
- [Less](https://github.com/less/less.js/) Helps to write faster styles.
- [firebase](https://github.com/firebase/) for managing notifications
- [md5](https://github.com/pvorb/node-md5) for encription passwords
- [cookies-js](https://github.com/ScottHamper/Cookies) for managing cookies

#### Utilities
- [Isomorphic Fetch](https://github.com/matthew-andrews/isomorphic-fetch) with [ES6-Promise](https://github.com/stefanpenner/es6-promise) for using fetch api on both client & server side.
- [Redux Thunk](https://github.com/gaearon/redux-thunk) for dispatching async actions.
- [Redux Connect](https://github.com/makeomatic/redux-connect) for resolving async props in react-router.
- [React Helmet](https://github.com/nfl/react-helmet)
- [classnames](https://github.com/JedWatson/classnames)
- [antd](https://github.com/ant-design/ant-design) for some button and form elements
- [lodash](https://github.com/lodash/lodash)
- [moment](https://github.com/moment/moment) to handle the timestamp converts

#### Build System
- [Webpack](https://github.com/webpack/webpack) for bundling.
  - [Awesome TypeScript Loader](https://github.com/s-panferov/awesome-typescript-loader) as ts loader.
  - [Babel Loader](https://github.com/babel/babel-loader) as js loader.
  - [React Hot Loader](https://github.com/gaearon/react-hot-loader) for providing hot reload capability to our development server
  - [Isomorphic Style Loader](https://github.com/kriasoft/isomorphic-style-loader) for loading styles on server-side.
  - [Style Loader](https://github.com/webpack/style-loader)
  - [CSS Loader](https://github.com/webpack/css-loader)
  - [PostCSS Loader](https://github.com/postcss/postcss)
    - [PostCSS cssnext](https://github.com/MoOx/postcss-cssnext)
    - [PostCSS Assets](https://github.com/assetsjs/postcss-assets)
  - [JSON Loader](https://github.com/webpack/json-loader)
  - [File Loader](https://github.com/webpack/file-loader)
  - [URL Loader](https://github.com/webpack/url-loader)
  - [Sourcemap Loader](https://github.com/webpack/source-map-loader)
  - [Manifest Plugin](https://github.com/danethurber/webpack-manifest-plugin)
  - [Extract Text Plugin](https://github.com/webpack/extract-text-webpack-plugin) for exporting bundled css. 
  - [tslint Loader](https://github.com/wbuchwalter/tslint-loader) for using tslint as preloader on build process.
  - [stylelint Loader](https://github.com/adrianhall/stylelint-loader) for using stylelint as preloader on build process.
  - [Istanbul Instrumenter Loader](https://github.com/deepsweet/istanbul-instrumenter-loader) for using istanbul on postload process while generating code coverage reports.

#### Dev & Prod Server
- [Webpack Dev Server](https://github.com/webpack/webpack-dev-server)
  - [Webpack Dev Middleware](https://github.com/webpack/webpack-dev-middleware)
  - [Webpack Hot Middleware](https://github.com/webpack/webpack-hot-middleware)
- [Express](https://github.com/expressjs/express) for running server both on client and server side.
- [Compression](https://github.com/expressjs/compression) for gzip compression
- [Serve Favicon](https://github.com/expressjs/serve-favicon) for serving favicon.

#### Developer Experience
- [Typings](https://github.com/typings/typings) for installing type definitions of external libraries.
- [tslint](https://github.com/palantir/tslint) for linting TypeScript files.
- [stylelint](https://github.com/stylelint/stylelint) for linting styles.
- [Redux Logger](https://github.com/theaqua/redux-logger)
- [Redux DevTools](https://github.com/gaearon/redux-devtools)
- [Chalk](https://github.com/chalk/chalk) for colored terminal logs.
- [doctype](https://github.com/deepsweet/istanbul-instrumenter-loader) for ubuilding documenations

#### Testing
- [Karma](https://github.com/karma-runner/karma) as test runner with following plugins
  - [Karma-Webpack](https://github.com/webpack/karma-webpack)
  - [Karma-Mocha](https://github.com/karma-runner/karma-mocha)
  - [Karma-Chai](https://github.com/xdissent/karma-chai)
  - [Karma-Coverage](https://github.com/karma-runner/karma-coverage)
  - [Karma-PhantomJS Launcher](https://github.com/karma-runner/karma-phantomjs-launcher)
- [Mocha](https://github.com/mochajs/mocha) as testing framework.
- [Chai](https://github.com/chaijs/chai) as assertion library.
- [Enzyme](https://github.com/jquery/jquery) for rendering React Components.
- [Fetch Mock](https://github.com/wheresrhys/fetch-mock) for testing async actions.
- [Redux Mock Store](https://github.com/arnaudbenard/redux-mock-store) for creating mock stores.

## Directory Structure
```bash
.
├── build                       # Built, ready to serve app.
├── config                      # Root folder for configurations.
│   ├── test                    # Test configurations.
│   ├── types                   # Global type definitions, written by us.
│   ├── webpack                 # Webpack configurations.
│   └── main.ts                 # Generic App configurations.
├── node_modules                # Node Packages.
├── src                         # Source code.
│   ├── app                     # App folder.
│   │ ├── api                   # Nested api components.
│   │ ├── assets                # application icon and fonts
│   │ ├── components            # React Components.
│   │ ├── containers            # React/Redux Containers.
│   │ ├── redux                 # Redux related code aka data layer of the app.
│   │ │   ├── accounts          # Redux accounts module.
│   │ │   ├── app               # Redux app module.
│   │ │   ├── comments          # Redux comments module.
│   │ │   ├── places            # Redux places module.
│   │ │   ├── posts             # Redux posts module.
│   │ │   ├── IStore.ts         # Store interface.
│   │ │   ├── reducers.ts       # Main reducers file to combine them.
│   │ │   └── store.ts          # Redux store, contains global app state.
│   │ ├── scenes                # Main pages.
│   │ │   ├── private           # Pages for authenticated users.
│   │ │   └── public            # Pages for not logged in visitors.
│   │ ├── services              # Services for handling websockets and authentications. 
│   │ └── routes.tsx            # Routes.
│   ├── client.tsx              # Entry point for client side rendering.
│   └── server.tsx              # Entry point for server side rendering.
│   └── manigest.json           # Config file for browsers.
│   └── favicon.ico             # Favicon.
├── typings                     # Type definitions installed with typings.              
├── .dockerignore               # Tells docker which files to ignore.
├── .gitignore                  # Tells git which files to ignore.
├── .stylelintrc                # Configures stylelint.
├── Dockerfile                  # Dockerfile.
├── favicon.ico                 # Favicon.
├── package.json                # Package configuration.
├── README.md                   # This file
├── tsconfig.json               # TypeScript transpiler configuration.
├── tslint.json                 # Configures tslint.
└── typings.json                # Typings package configuration.
```

## Installation

You can clone from this repository or [install the latest version](http://git.ronaksoftware.com/nested/web-mobile-app) as a zip file or a tarball. 

```bash
$ git clone http://git.ronaksoftware.com/nested/web-mobile-app
$ cd mobile-app
$ yarn install
$ npm install
```

## Usage

All commands defaults to development environment. You can set `NODE_ENV` to `production` or use the shortcuts below.

```bash
# Running

$ npm start # This starts the app in development mode

# Starting it with the production build
$ NODE_ENV=production npm start # or
$ npm run start:prod

# Building 

$ npm build # This builds the app in development mode

# Commands below builds the production build
$ NODE_ENV=production npm build # or
$ npm run build:prod

# Testing
$ npm test
```

# output documenations
$ npm doc
```

For Windows users, we recommend using the shortcuts instead of setting environment variables because they work a little different on Windows.

## Notes
```bash
# If you want install additional libraries, you can also install their typings from DefinitelyTyped
$ typings install dt~<package> --global --save
# or if it's located on npm
$ typings install <package> --save
```

## Credits

Vortigern is released under the [MIT license](LICENSE). 

The image in this README belongs to [ronaksoft.com](http://ronaksoft.com).

___

## [Ronak Software Group](https://www.ronaksoft.com)

<a target="_blank" href="http://ronaksoft.com/"><img src="http://ronaksoft.com/favico.jpg" height="55px" /></a>

We help startups start and stay started by helping them plan, strategize, fund and execute their vision. 

You can contact us at [developers@nested.me](mailto:developers@nested.me)

Be sure to check out available [jobs at nested](https://nested.me/jobs).
