import useVMdParser from '@/modules/useVMdParser';
import PluginCreatorFn from '@/types/pluginCreatorFn';
import parser from './parser';

export default <PluginCreatorFn>(() => {
  return {
    install() {
      const vMdParser = useVMdParser();
      vMdParser.use(parser);
    },
  };
});
