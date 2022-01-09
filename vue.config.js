var path = require('path');

const backendLoader = 'style-loader';

const cssExtractPlugin = [];

if (process.env.STYLUS_COV) {
  console.log('dangit');
} else {
  console.log('hmm');
}

// if (useCssExtract) {
//   cssExtractPlugin.push(
//     new MiniCssExtractPlugin({
//       filename: 'style/[name].css',
//     })
//   );
// }

module.exports = {
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      if (process.env.NODE_ENV == 'development') {
        args[0].template = './dev/index.html';
      }
      return args;
    });
  },
  configureWebpack: {
    target: 'web',
    devtool: 'source-map',
    resolve: {
      extensions: ['.js', '.ts', '.vue', '.css'],
      alias: {
        '@': path.join(__dirname, './src'),
      },
    },
    externals: [
      {
        consolidate: 'commonjs consolidate',
      },
    ],
    // module: {
    //   rules: [
    //     {
    //       test: /\.tsx?$/,
    //       loader: 'ts-loader',
    //       options: {
    //         appendTsSuffixTo: [/\.vue$/],
    //       },
    //       exclude: /node_modules/,
    //     },
    //     {
    //       test: /\.css/,
    //       sideEffects: true,
    //       use: [backendLoader, 'css-loader', 'postcss-loader'],
    //     },
    //     {
    //       test: /\.scss/,
    //       sideEffects: true,
    //       use: [backendLoader, 'css-loader', 'postcss-loader', 'sass-loader'],
    //     },
    //     {
    //       test: /\.vue$/,
    //       loader: 'vue-loader',
    //     },
    //     // {
    //     //   test: /\.(js)$/,
    //     //   exclude: /node_modules/,
    //     //   use: {
    //     //     loader: 'babel-loader',
    //     //     // enable sub-packages to find babel config
    //     //     options: {
    //     //       rootMode: 'upward',
    //     //     },
    //     //   },
    //     // },
    //     {
    //       test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
    //       loader: 'url-loader',
    //       options: {
    //         limit: 10000,
    //         publicPath: '../',
    //         name: 'fonts/[name].[hash:7].[ext]',
    //       },
    //     },
    //   ],
    // },
  },
};
