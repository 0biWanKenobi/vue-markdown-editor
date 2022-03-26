import PluginCreatorFn from '@/types/pluginCreatorFn';
import parser from './parser';

const createAlignPlugin: PluginCreatorFn = () => {
  return {
    install(state) {
      state.parser.use(parser);
    },
  };
};

export default createAlignPlugin;
