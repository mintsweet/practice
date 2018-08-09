const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar');
const config = require('../config.default');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: '/',
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.jsx']
  },
  devServer: {
    port: config.manage_port,
    noInfo: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        pathRewrite: {"^/api" : "/"}
      }
    },
    open: true
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env', 'react', 'stage-2'],
            plugins: [
              ['import', {
                libraryName: 'antd',
                style: true
              }],
              'transform-decorators-legacy',
              ['transform-runtime', {
                'polyfill': false,
                'regenerator': true
              }]
            ]
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
              modifyVars: {
                '@primary-color': '#52c41a'
              }
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[name]__[local]-[hash:base64:5]'
            }
          },
          {
            loader: 'sass-loader',
          }
        ]
      },
      {
        test: /\.(png|jpge?|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './public/template.ejs'),
      filename: 'index.html',
      inject: true,
      title: 'Mints(薄荷糖社区) - 后台管理系统',
      favicon: path.resolve(__dirname, './public/favicon.ico')
    }),
    new WebpackBar()
  ]
};