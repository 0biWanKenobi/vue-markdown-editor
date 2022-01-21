import fs from 'fs-extra';
import path from 'path';

/**
 * @typedef { import("rollup").AsyncPluginHooks } AsyncPluginHooks
 * @typedef { import("rollup").Plugin } Plugin
 *
 * @typedef {Object} PackageJson
 * @property {string} savePath
 * @property {string} main
 * @property {string} module
 * @property {string} types
 *
 * @typedef {Object} GeneratePluginOptions
 * @property {Array<PackageJson>} packages
 * @property {string} outDir
 * @property {AsyncPluginHooks} hook
 */

/**
 *
 * @type {(options: GeneratePluginOptions) => Plugin}
 */
const generate = (options = {}) => {
  if (!'packages' in options || !'hook' in options || !options.packages?.length)
    return {
      name: 'clean-declarations',
    };

  const { packages = [], outDir, hook = 'writeBundle' } = options;
  return {
    name: 'generate-package-json',
    [hook]: async () => {
      for (const { savePath, main, module, types } of packages) {
        await fs.writeJSON(
          path.resolve(outDir, savePath, 'package.json'),
          {
            main,
            module,
            types,
          },
          {
            spaces: 2,
          }
        );
      }
    },
  };
};

export default generate;
