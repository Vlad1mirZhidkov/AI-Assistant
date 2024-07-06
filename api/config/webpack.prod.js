const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'production',
  entry: './config/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  resolve: {
    fallback: {
      "fs": false, 
      "net": false,
      "tls": false,
      "crypto": require.resolve('crypto-browserify'),
      "assert": require.resolve('assert/'),
      "http": require.resolve("stream-http"),
      "https": require.resolve("https-browserify"),
      "stream": require.resolve("stream-browserify"),
      "url": require.resolve("url/"),
      "querystring": require.resolve("querystring-es3"),
      "process": require.resolve("process/browser"),
      "buffer": require.resolve("buffer/"),
      "util": require.resolve("util/"),
      "path": require.resolve("path-browserify"),
      "os": require.resolve("os-browserify/browser"),
      "vm": require.resolve("vm-browserify"),
      "child_process": false
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
};
