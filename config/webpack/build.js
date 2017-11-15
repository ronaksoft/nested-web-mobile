var fs = require('fs');
var path = require('path');
var webpack = require('webpack');
var postcssAssets = require('postcss-assets');
var postcssNext = require('postcss-cssnext');
var stylelint = require('stylelint');
var ManifestPlugin = require('webpack-manifest-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');

const lessToJs = require('less-vars-to-js');
const themeVariables = lessToJs(fs.readFileSync(path.join(path.resolve('./src/app'), 'ant-theme-vars.less'), 'utf8'));

var config = {
  bail: true,

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    modules: [path.resolve(__dirname), 'node_modules', 'app', 'app/redux'],
  },

  entry: {
    app: './src/client.tsx',
    vendor: [
      'react',
      'react-dom',
      'react-router',
      'react-helmet',
      'react-redux',
      'react-router-redux',
      'redux',
      'redux-connect',
      'redux-thunk'
    ]
  },

  output: {
    path: path.resolve('./build/public'),
    publicPath: '/',
    filename: 'js/[name].[chunkhash].js'
  },

  module: {
    rules: [{
      enforce: 'pre',
      test: /\.tsx?$/,
      loader: 'tslint-loader'
    },
      {
        test: /\.tsx?$/,
        loader: 'react-hot-loader!awesome-typescript-loader'
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.css$/,
        include: path.resolve('./src/app'),
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            'css-loader?modules&importLoaders=10&localIdentName=[local]___[hash:base64:5]',
            'postcss-loader'
          ]
        })
      },
      {
        test: /\.css$/,
        exclude: path.resolve('./src/app'),
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: [
            'css-loader',
          ]
        })
      },
      {
        test: /\.less$/,
        use: [
          {loader: "style-loader"},
          {loader: "css-loader"},
          {loader: "less-loader",
            options: {
              modifyVars: themeVariables
            }
          }
        ]
      },
      {
        test: /\.eot(\?.*)?$/,
        loader: 'file-loader?name=fonts/[hash].[ext]'
      },
      {
        test: /\.(woff|woff2)(\?.*)?$/,
        loader: 'file-loader?name=fonts/[hash].[ext]'
      },
      {
        test: /\.ttf(\?.*)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream&name=fonts/[hash].[ext]'
      },
      {
        test: /\.svg(\?.*)?$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml&name=fonts/[hash].[ext]'
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader: 'url-loader?limit=1000&name=images/[hash].[ext]'
      }
    ]
  },

  plugins: [
    new WebpackCleanupPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        tslint: {
          failOnHint: true
        },
        postcss: function () {
          return [
            stylelint({
              files: '../../src/app/*.css'
            }),
            postcssNext(),
            postcssAssets({
              relative: true
            }),
          ];
        },
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        tslint: {
          failOnHint: true
        },
        postcss: function () {
          return [
            stylelint({
              files: '../../src/app/*.css'
            }),
            postcssNext(),
            postcssAssets({
              relative: true
            }),
          ];
        },
      }
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false,
    //     screw_ie8: true,
    //     drop_console: true,
    //     drop_debugger: true
    //   }
    // }),
    // new webpack.optimize.OccurrenceOrderPlugin(),
    new ExtractTextPlugin('css/[name].[hash].css'),
    new ManifestPlugin({
      fileName: '../manifest.json'
    }),
    new HtmlWebpackPlugin({
      template: './src/template.html',
      files: {
        css: ['style.css'],
        js: ['bundle.js'],
      }
    })
  ]
};

const copySync = (src, dest, overwrite) => {
  if (overwrite && fs.existsSync(dest)) {
    fs.unlinkSync(dest);
  }
  const data = fs.readFileSync(src);
  fs.writeFileSync(dest, data);
};

const createIfDoesntExist = dest => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest);
  }
};

createIfDoesntExist('./build');
createIfDoesntExist('./build/public');
createIfDoesntExist('./build/public/images');
copySync('./src/favicon.ico', './build/public/favicon.ico', true);
copySync('./src/manifest.json', './build/public/manifest.json', true);
copySync('./src/app/assets/images/nested-24.png', './build/public/images/nested-24.png', true);
copySync('./src/app/assets/images/nested-48.png', './build/public/images/nested-48.png', true);
copySync('./src/app/assets/images/nested-72.png', './build/public/images/nested-72.png', true);
copySync('./src/app/assets/images/nested-96.png', './build/public/images/nested-96.png', true);
copySync('./src/app/assets/images/nested-144.png', './build/public/images/nested-144.png', true);
copySync('./src/app/assets/images/nested-168.png', './build/public/images/nested-168.png', true);
copySync('./src/app/assets/images/nested-192.png', './build/public/images/nested-192.png', true);
copySync('./src/app/assets/images/nested-512.png', './build/public/images/nested-512.png', true);

module.exports = config;
