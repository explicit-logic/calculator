const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    app: './src/scripts/index.ts'
  },
  devtool: 'inline-source-map',
  output: {
      filename: '[name].js',
      path: path.resolve(__dirname, '..', 'dist'),
  },
  module: {
      rules: [
          {
              test: /\.tsx?$/,
              loader: 'ts-loader',
              exclude: /node_modules/,
          },
          {
            test:/\.s?css$/,
            use: ExtractTextPlugin.extract({
              fallback:'style-loader',
              use:['css-loader','sass-loader'],
            })
         },
         {
          test: /\.(gif|png|jpe?g|svg)$/i,
          use: [
            'file-loader',
            {
              loader: 'image-webpack-loader',
              options: {
                mozjpeg: {
                  progressive: true,
                  quality: 65
                },
                // optipng.enabled: false will disable optipng
                optipng: {
                  enabled: false,
                },
                pngquant: {
                  quality: [0.65, 0.90],
                  speed: 4
                },
                gifsicle: {
                  interlaced: false,
                },
                // the webp option will enable WEBP
                webp: {
                  quality: 75
                }
              }
            },
          ],
        }
      ]
  },
  resolve: {
      extensions: [".tsx", ".ts", ".js"]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new ExtractTextPlugin({filename:'app.css'}),
    new HtmlWebpackPlugin({
      title: 'Production',
      template: 'src/index.html',
      filename: 'index.html',
      hash: true,
    }),
  ],
};

