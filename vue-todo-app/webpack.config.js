const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { merge } = require('webpack-merge')
require('@babel/polyfill')

module.exports = (env, opts) => {

  const config = {
    mode: 'production',
    // 중복되는 옵션들..
    resolve: {
      extensions: ['.vue', '.js'],
      // alias: {
      //   path: require.resolve("path-browserify")
      // },
      fallback: {
        // "fs": false,
        // "tls": false,
        // "net": false,
        // "path": false,
        // "zlib": false,
        // "http": false,
        // "https": false,
        "stream": false,
        "crypto": false,
        "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify 
      }
    },
    // 진입점
    entry: {
      app: ['@babel/polyfill', path.join(__dirname, 'main.js')]
    },
    // 결과물에 대한 설정
    output: {
      filename: '[name].js', // app.js
      path: path.join(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: ['vue-style-loader', 'css-loader', 'postcss-loader']
        },
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html')
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'assets/',
            to: ''
          }
        ]
      })
    ]
  }
  // 개발용
  if (opts.mode === 'development') {
    return merge(config, {
      // 추가 개발용 옵션
      devtool: 'eval',
      devServer: {
        open: false,
        hot: true
      }
    })
    // 개발용
  } else {
    return merge(config, {
      // 추가 제품용 옵션
      devtool: 'cheap-module-source-map',
      plugins: [new CleanWebpackPlugin()]
    })
  }
  // 제품용
  // if(opts.mode === 'production'){

  // }
}
