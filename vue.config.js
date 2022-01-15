var path = require('path');

const TSCONFIG_PATH = path.resolve(__dirname, './app.tsconfig.json');

/**
 *  @typedef { import("@vue/cli-service").ProjectOptions } Options
 *  @type { Options }
 */
module.exports = {
  outputDir: path.join(__dirname, './lib'),
  filenameHashing: false,
  chainWebpack: (config) => {
    config.externals([
      {
        consolidate: 'commonjs consolidate',
      },
    ]);

    if (process.env.NODE_ENV == 'development') {
      config.plugin('html').tap((args) => {
        {
          args[0].template = './dev/index.html';
        }
        return args;
      });
    } else {
      config.plugin('fork-ts-checker').tap((args) => {
        args[0].typescript.configFile = './app.tsconfig.json';
        return args;
      });

      let externals = config.get('externals');
      config.externals([
        ...externals,
        {
          vue: {
            root: 'Vue',
            commonjs: 'vue',
            commonjs2: 'vue',
            amd: 'vue',
          },
        },
      ]);

      config.module
        .rule('ts')
        .use('ts-loader')
        .merge({
          options: {
            configFile: TSCONFIG_PATH,
          },
        });

      config.optimization.splitChunks(false).minimize(false);
      // allow to access default export from src/main.ts direcly, w/out typing VMdEditor.default

      // config.output.filename('VMdEditor.[name].js').library('VMdEditor');

      config.output.library(['VMdEditor', '[name]']).libraryTarget('umd').umdNamedDefine(true);

      config.entry('preview').add('./src/preview.ts');
      config.entry('editor').add('./src/editor.ts');
      config.entry('lang').add('./src/lang/index.ts');
      config.entry('types').add('./src/types.ts');
      config.entry('theme').add('./src/theme/index.ts');
      config.entry('plugins').add('./src/plugins/index.ts');
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
