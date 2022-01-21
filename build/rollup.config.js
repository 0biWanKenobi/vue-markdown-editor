// rollup.config.js
import fs from 'fs';
import path from 'path';
import vue from 'rollup-plugin-vue';
import alias from '@rollup/plugin-alias';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import babel from '@rollup/plugin-babel';
import scss from 'rollup-plugin-scss';
import PostCSS from 'rollup-plugin-postcss';
import ttypescript from 'ttypescript';
import typescript from 'rollup-plugin-typescript2';
import minimist from 'minimist';
import clean from './cleanupDeclarationsPlugin';
import generate from './generatePackageJsonPlugin';

// https://github.com/rollup/rollup/issues/2688

// Get browserslist config and remove ie from es build targets
const esbrowserslist = fs
  .readFileSync('./.browserslistrc')
  .toString()
  .split('\n')
  .filter((entry) => entry && entry.substring(0, 2) !== 'ie');

// Extract babel preset-env config, to combine with esbrowserslist
const babelPresetEnvConfig = require('../babel.config').presets.filter(
  (entry) => entry[0] === '@babel/preset-env'
)[0][1];

const argv = minimist(process.argv.slice(2));

const projectRoot = path.resolve(__dirname, '..');

const baseConfig = {
  input: {
    main: 'src/main.ts',
    'editor/index': 'src/editor.ts',
    'preview/index': 'src/preview.ts',
    'lang/index': 'src/lang/index.ts',
    'typings/index': 'src/types.ts',
    'theme/index': 'src/theme/index.ts',
    'plugins/index': 'src/plugins/index.ts',
  },
  plugins: {
    scss: {
      output: 'dist/assets/css/bundle.css',
    },
    preVue: [
      alias({
        entries: [
          {
            find: '@',
            replacement: `${path.resolve(projectRoot, 'src')}`,
          },
        ],
      }),
    ],
    replace: {
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true,
    },
    vue: {
      preprocessStyles: true,
      preprocessOptions: {
        scss: {
          includePaths: ['src/', 'src/styles/'],
        },
      },
    },
    postVue: [
      resolve({
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
        preferBuiltins: false,
      }),
      // Process only `<style module>` blocks.
      PostCSS({
        modules: {
          generateScopedName: '[local]___[hash:base64:5]',
        },
        include: /&module=.*\.css$/,
      }),
      // Process all `<style>` blocks except `<style module>`.
      PostCSS({ include: /(?<!&module=.*)\.css$/ }),
      commonjs({
        include: /node_modules/,
      }),
    ],
    babel: {
      exclude: 'node_modules/**',
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
      plugins: ['@vue/babel-plugin-jsx'],
      babelHelpers: 'bundled',
    },
    copy: {
      targets: [
        { src: 'src/assets/font/*', dest: 'dist/assets/font' },
        { src: 'build/package.json', dest: 'dist/' },
      ],
    },
    clean: {
      targets: [
        path.resolve(projectRoot, 'dist/types/classes'),
        path.resolve(projectRoot, 'dist/types/command'),
        path.resolve(projectRoot, 'dist/types/components'),
        path.resolve(projectRoot, 'dist/types/hotkeys'),
        path.resolve(projectRoot, 'dist/types/interfaces'),
        path.resolve(projectRoot, 'dist/types/toolbar'),
        path.resolve(projectRoot, 'dist/types/utils'),
      ],
    },
    /** @type import("generatePackageJsonPlugin").GeneratePluginOptions */
    generate: {
      outDir: path.resolve(projectRoot, 'dist'),
      packages: [
        {
          savePath: 'editor',
          module: 'index.esm.mjs',
          types: '../types/editor.d.ts',
        },
        {
          savePath: 'lang',
          module: 'index.esm.mjs',
          types: '../types/lang/index.d.ts',
        },
        {
          savePath: 'plugins',
          module: 'index.esm.mjs',
          types: '../types/plugins/index.d.ts',
        },
        {
          savePath: 'preview',
          module: 'index.esm.mjs',
          types: '../types/preview.d.ts',
        },
        {
          savePath: 'theme',
          module: 'index.esm.mjs',
          types: '../types/theme/index.d.ts',
        },
        {
          savePath: 'typings',
          module: 'index.esm.mjs',
          types: '../types/types.d.ts',
        },
      ],
    },
  },
};

// ESM/UMD/IIFE shared settings: externals
// Refer to https://rollupjs.org/guide/en/#warning-treating-module-as-external-dependency
const external = [
  // list external dependencies, exactly the way it is written in the import statement.
  // eg. 'jquery'
  'vue',
];

// UMD/IIFE shared settings: output.globals
// Refer to https://rollupjs.org/guide/en#output-globals for details
const globals = {
  // Provide global variable names to replace your external imports
  // eg. jquery: '$'
  vue: 'Vue',
};

// Customize configs for individual targets
const buildFormats = [];
if (!argv.format || argv.format === 'es') {
  const esConfig = {
    ...baseConfig,
    input: {
      ...baseConfig.input,
      main: 'src/main.esm.ts',
    },
    external,
    output: {
      dir: 'dist',
      // file: 'dist/v-md-editor.esm.js',
      entryFileNames: '[name].esm.mjs',
      chunkFileNames: '[name]-[hash].esm.mjs',
      format: 'esm',
      exports: 'named',
    },
    plugins: [
      replace(baseConfig.plugins.replace),
      json(),
      ...baseConfig.plugins.preVue,
      scss(baseConfig.plugins.scss),
      vue(baseConfig.plugins.vue),
      ...baseConfig.plugins.postVue,
      // Only use typescript for declarations - babel will
      // do actual js transformations
      typescript({
        typescript: ttypescript,
        tsconfig: `${path.resolve(__dirname, '../tsconfig.build.json')}`,
        useTsconfigDeclarationDir: true,
        emitDeclarationOnly: true,
        abortOnError: false,
      }),
      babel({
        ...baseConfig.plugins.babel,
        presets: [
          [
            '@babel/preset-env',
            {
              ...babelPresetEnvConfig,
              targets: esbrowserslist,
            },
          ],
        ],
      }),
      copy({
        targets: [
          ...baseConfig.plugins.copy.targets,
          { src: 'build/index/index.esm.mjs', dest: 'dist' },
          { src: 'build/index/index.esm.d.ts', dest: 'dist/types' },
        ],
      }),
      clean(baseConfig.plugins.clean),
      generate(baseConfig.plugins.generate),
    ],
  };
  buildFormats.push(esConfig);
}

if (!argv.format || argv.format === 'cjs') {
  const umdConfig = {
    ...baseConfig,
    input: {
      main: 'src/main.cjs.ts',
    },
    external,
    output: {
      compact: true,
      dir: 'dist',
      // file: 'dist/v-md-editor.esm.js',
      entryFileNames: '[name].cjs',
      chunkFileNames: '[name]-[hash].cjs',
      format: 'cjs',
      name: 'VMdEditor',
      exports: 'named',
      globals,
    },
    plugins: [
      replace(baseConfig.plugins.replace),
      json(),
      ...baseConfig.plugins.preVue,
      scss(baseConfig.plugins.scss),
      vue(baseConfig.plugins.vue),
      ...baseConfig.plugins.postVue,
      typescript({
        typescript: ttypescript,
        tsconfig: `${path.resolve(__dirname, '../tsconfig.build.json')}`,
        useTsconfigDeclarationDir: true,
        emitDeclarationOnly: true,
        abortOnError: false,
      }),
      babel(baseConfig.plugins.babel),
      copy({
        targets: [
          ...baseConfig.plugins.copy.targets,
          { src: 'build/index/index.cjs', dest: 'dist' },
          { src: 'build/index/index.d.ts', dest: 'dist/types' },
        ],
      }),
      clean(baseConfig.plugins.clean),
    ],
  };
  buildFormats.push(umdConfig);
}

// Export config
export default buildFormats;
