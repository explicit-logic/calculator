const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/scripts/index.ts',
  devtool: 'inline-source-map',
  output: {
      filename: 'app.js',
      path: path.resolve(__dirname, 'dist', 'scripts')
  },
  module: {
      rules: [
          {
              test: /\.tsx?$/,
              loader: 'ts-loader',
              exclude: /node_modules/,
          },
      ]
  },
  resolve: {
      extensions: [".tsx", ".ts", ".js"]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Production',
    }),
  ],
};

