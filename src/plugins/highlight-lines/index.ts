import parser from './parser';
import PluginCreatorFn from '@/types/pluginCreatorFn';

export default <PluginCreatorFn>function () {
  return {
    install(state) {
      state.parser.use(parser);
    },
  };
};
