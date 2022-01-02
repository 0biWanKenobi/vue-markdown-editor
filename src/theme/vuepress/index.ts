import parser from './parser';
import createTipPlugin from '@/plugins/tip/index';

// style
import '@/assets/css/theme/base';
import '@/assets/css/theme/vuepress-markdown';

// tip plugin style
import '@/plugins/tip/tip.css';
import useVMdParser from '@/modules/useVMdParser';
import useEditor from '@/modules/useEditor';

const install = function (options: Record<string, any> | undefined) {
  const vMdParser = useVMdParser();
  const tipPlugin = createTipPlugin();
  const { editor: vMdEditor } = useEditor();

  vMdParser.use(parser, options);
  vMdEditor.use(tipPlugin);
};

export default {
  install,
};
