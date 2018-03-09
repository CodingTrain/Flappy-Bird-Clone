const path = require('path');

module.exports = {
  entry: path.resolve(path.join(__dirname, 'src', 'sketch.js')),
  resolve: {
    modules: [
      path.resolve(__dirname, './node_modules'),
      path.resolve(__dirname, './src')
    ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/'
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist/'
  }
};

