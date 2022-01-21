import fs from 'fs-extra';

/**
 * @typedef { import("rollup").AsyncPluginHooks } AsyncPluginHooks
 * @typedef { import("rollup").Plugin } Plugin
 *
 * @typedef {Object} CleanupPluginOptions
 * @property {Array<string>} targets
 * @property {AsyncPluginHooks} hook
 */

/**
 *
 * @type {(options: CleanupPluginOptions) => Plugin}
 */
const clean = (options = {}) => {
  if (!'targets' in options || !'hook' in options || !options.targets?.length)
    return {
      name: 'clean-declarations',
    };

  const { targets = [], hook = 'writeBundle' } = options;
  return {
    name: 'clean-declarations',
    [hook]: async () => {
      for (const target of targets) {
        const stat = await fs.lstat(target);

        fs.rmSync(target, {
          force: true,
          recursive: true,
        });
      }
    },
  };
};

export default clean;
