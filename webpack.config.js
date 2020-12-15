module.exports = {
  entry: './src/index.js',
  mode: 'development',
  devtool: "eval-source-map",
  devServer: {
    contentBase: './dist',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          
        }
      },
    ]
  },
};
