const path = require('path');
const { DuplicatesPlugin } = require('inspectpack/plugin');

module.exports = {
  entry: './src/main.ts',
  devtool: 'inline-source-map',
  mode: 'development',
  plugins: [
    new DuplicatesPlugin({
      emitErrors: false,
      verbose: false
    })
  ],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [
          path.resolve(__dirname, 'node_modules')
        ],
        //include: [
        //  path.resolve(__dirname, 'src'),
        //  path.resolve(__dirname, 'node_modules/fosfeno/src'),
        //]
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    alias: {
      'pixi.js': path.resolve(__dirname, 'node_modules/pixi.js'),
      'matter-js': path.resolve(__dirname, 'node_modules/matter-js')
    }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};