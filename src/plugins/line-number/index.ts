import PluginCreatorFn from '@/types/pluginCreatorFn';
import parser from './parser';

export default <PluginCreatorFn>(() => {
  return {
    install(state) {
      state.parser.use(parser);
    },
  };
});
