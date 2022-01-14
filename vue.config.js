var path = require('path');

/**
 *  @typedef { import("@vue/cli-service").ProjectOptions } Options
 *  @type { Options }
 */
module.exports = {
  outputDir: path.join(__dirname, './lib'),
  chainWebpack: (config) => {
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
  },
};
