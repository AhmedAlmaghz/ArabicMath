const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/ArabicMath.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'arabic-math-webpack.js',
    library: 'ArabicMath',
    libraryTarget: 'umd',
    globalObject: "typeof self !== 'undefined' ? self : this"
  },
  module: {
    rules: []
  },
  resolve: { extensions: ['.js'] },
  devtool: 'source-map'
};
