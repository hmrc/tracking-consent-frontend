const CopyPlugin = require('copy-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    servicePage: './src/entrypoints/servicePage.ts',
    settingsPage: './src/entrypoints/settingsPage.ts'
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: ['babel-loader', 'ts-loader'],
        exclude: /node_modules/,
      },
      {
        test: /\.html$/i,
        loader: 'raw-loader',
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /.+\.(en|cy|conf)$/,
        loader: 'message-format-loader'
      }
    ],
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
  },
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'src/loaders')
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, '../../../../../../public'),
    port: 8081,
    historyApiFallback: true,
  },
  output: {
    path: path.resolve(__dirname, '../../../../../../public'),
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        sourceMap: true,
        uglifyOptions: {
          ie8: true,
        }
      })
    ]
  }
};