const path = require('path');

module.exports = {
  entry: {
    transitional: './src/entrypoints/transitional.ts',
    a: './src/entrypoints/a.ts',
    b: './src/entrypoints/b.ts',
    c: './src/entrypoints/c.ts',
    d: './src/entrypoints/d.ts',
    e: './src/entrypoints/e.ts',
    f: './src/entrypoints/f.ts',
    sdes: './src/entrypoints/sdes.ts',
    settingsPage: './src/entrypoints/settingsPage.ts',
    optimizely: './src/entrypoints/optimizely.js'
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
  output: {
    path: path.resolve(__dirname, '../../../../../../public'),
  }
};