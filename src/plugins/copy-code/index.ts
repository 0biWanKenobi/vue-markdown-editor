import parser from './parser';
import createCopyCodePreview from './preview';
import PluginCreatorFn from '@/types/pluginCreatorFn';

export default <PluginCreatorFn>function () {
  return {
    install(state) {
      state.parser.use(parser);

      state.use(createCopyCodePreview());
    },
  };
};
