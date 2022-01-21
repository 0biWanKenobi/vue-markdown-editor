var path = require('path');

const TSCONFIG_CJS_PATH = path.resolve(__dirname, './tsconfig.cjs.json');

/**
 *  @typedef { import("@vue/cli-service").ProjectOptions } Options
 *  @type { Options }
 */
module.exports = {
  filenameHashing: false,
  chainWebpack: (config) => {
    config.externals([
      {
        consolidate: 'commonjs consolidate',
      },
    ]);

    if (process.env.MODULE == 'cjs') {
      config.module
        .rule('ts')
        .use('ts-loader')
        .merge({
          options: {
            configFile: TSCONFIG_CJS_PATH,
          },
        });

      config.plugin('fork-ts-checker').tap((args) => {
        args[0].typescript.configFile = TSCONFIG_CJS_PATH;
        return args;
      });
    }

    if (process.env.NODE_ENV == 'development') {
      config.plugin('html').tap((args) => {
        {
          args[0].template = './dev/index.html';
        }
        return args;
      });
    }
  },
  configureWebpack: {
    target: 'web',
    devtool: 'source-map',
    // allow to access default export from src/main.ts direcly, w/out typing VMdEditor.default
    // output: {
    //   libraryExport: 'default',
    // },
    resolve: {
      extensions: ['.js', '.ts', '.vue', '.css'],
      alias: {
        '@': path.join(__dirname, './src'),
      },
    },
  },
};
