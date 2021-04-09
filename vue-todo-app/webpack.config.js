const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const merge = require('webpack-merge')
require('@babel/polyfill')

module.exports = (env, opts) => {
  const config = {
    mode: 'production',
    // 중복되는 옵션들..
    resolve: {
      extensions: ['.vue', '.js'],
      alias: {
        '~': path.resolve(__dirname),
        'scss': path.resolve(__dirname, './scss/')
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

      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'index.html')
      }),
      new VueLoaderPlugin(),
      new CopyPlugin([
        {
          from: 'assets/',
          to: ''
        }
      ])
    ]
  }
  // 개발용
  if (opts.mode === 'development') {
    return merge(config, {
      // 빌드 시간이 적고, 디버깅이 가능한 방식
      devtool: 'eval',
      devServer: {
        // 자동으로 기본 브라우저를 오픈합니다
        open: false,
        // HMR, https://webpack.js.org/concepts/hot-module-replacement/
        hot: true
      }
    })

    // opts.mode === 'production'
  } else {
    return merge(config, {
      // 용량이 적은 방식
      devtool: 'cheap-module-source-map',
      plugins: [
        // 빌드(build) 직전 `output.path`(`dist` 디렉터리) 내 기존 모든 파일 삭제
        new CleanWebpackPlugin()
      ]
    })
  }
  // 제품용
  // if(opts.mode === 'production'){

  // }
}
