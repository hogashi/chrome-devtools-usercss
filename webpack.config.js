module.exports = {
  entry: {
    index: './src/index.ts',
    background: './src/background.ts',
    popup: './src/popup.ts',
  },
  output: {
    filename: '[name].js',
    path: __dirname + '/dist',
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          { loader: 'ts-loader' },
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                [
                  '@babel/preset-react',
                    // for new jsx transform in react 17 https://babeljs.io/blog/2020/03/16/7.9.0#a-new-jsx-transform-11154httpsgithubcombabelbabelpull11154
                  { runtime: 'automatic' },
                ],
              ],
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },

  optimization: {
    // no minimize for chrome extension
    minimize: false,
  },

  // When importing a module whose path matches one of the following, just
  // assume a corresponding global variable exists and use that instead.
  // This is important because it allows us to avoid bundling all of our
  // dependencies, which allows browsers to cache those libraries between builds.
  // externals: {
  //   "react": "React",
  //   "react-dom": "ReactDOM"
  // }
};
