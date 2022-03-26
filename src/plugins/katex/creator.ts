import PluginCreatorFn from '@/types/pluginCreatorFn';

export default function (parser: Function | { install: Function }) {
  const createKatexPlugin: PluginCreatorFn = (katexOptions) => {
    return {
      install(state) {
        state.parser.use(parser, katexOptions);
      },
    };
  };

  return createKatexPlugin;
}
