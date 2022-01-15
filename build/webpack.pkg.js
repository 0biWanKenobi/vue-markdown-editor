// https://5balloons.info/create-publish-you-first-vue-plugin-on-npm-the-right-way/
// https://www.codemag.com/Article/2103071/The-Complete-Guide-to-Vue-3-Plug-ins-Part-2
// https://blog.logrocket.com/building-vue-3-component-library/
// https://dev.to/htech/creating-a-vue-module-with-rollup-and-typescript-4igb

const path = require('path');
const merge = require('webpack-merge');
const getBaseConfig = require('./webpack.base');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');

module.exports = merge(getBaseConfig({ useCssExtract: true }), {
  mode: 'production',
  entry: path.join(__dirname, '../src/main.ts'),
  output: {
    library: 'VMdEditor',
    libraryTarget: 'umd',
    libraryExport: 'default',
    path: path.join(__dirname, '../lib'),
    umdNamedDefine: true,
    filename: '[name].js',
  },
  externals: {
    vue: {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue',
    },
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano,
      cssProcessorPluginOptions: {
        preset: ['default', { discardComments: { removeAll: true } }],
      },
      canPrint: true,
    }),
  ],
});
