const webpack = require('webpack')
const dotenv = require('dotenv')

const isDev = process.env.NODE_ENV === 'development'

// Be able to use dotenv for Frontend env variables (e.g. secrets)
// https://medium.com/@trekinbami/using-environment-variables-in-react-6b0a99d83cf5
let env
let envKeys
let plugins = []
try {
  env = dotenv.config().parsed
  envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next])
    return prev
  }, {})
  plugins = [new webpack.DefinePlugin(envKeys)]
} catch (err) {
  console.log('not using .env b/c of error: ', err)
}

module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: [
    '@babel/polyfill', // enables async-await
    './client/index.js',
  ],
  output: {
    path: __dirname,
    filename: './public/bundle.js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  devtool: 'source-map',
  watchOptions: {
    ignored: /node_modules/,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          'css-loader',
          //'sass-loader',
          // {
          //   loader: "sass-loader",
          //   options: {
          //     implementation: require("sass"),
          //     sassOptions: {
          //       fiber: false,
          //     },
          //   },
          // }
        ],
      },
    ],
  },
  plugins: plugins,
}
