const path = require('path');

module.exports = {
  entry: {
    tracking: './js/src/entrypoints/tracking.ts',
    settingsPage: './js/src/entrypoints/settingsPage.ts',
    optimizely: './js/src/entrypoints/optimizely.js',
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
        loader: 'message-format-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  resolveLoader: {
    modules: [
      'node_modules',
      path.resolve(__dirname, 'js/src/loaders'),
    ],
  },
  output: {
    path: path.resolve(__dirname, 'public'),
  },
};
