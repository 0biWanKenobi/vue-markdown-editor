import useVMdParser from '@/modules/useVMdParser';
import PluginCreatorFn from '@/types/pluginCreatorFn';

export default function (parser: Function | { install: Function }) {
  const createKatexPlugin: PluginCreatorFn = (katexOptions) => {
    return {
      install() {
        const vMdParser = useVMdParser();
        vMdParser.use(parser, katexOptions);
      },
    };
  };

  return createKatexPlugin;
}
