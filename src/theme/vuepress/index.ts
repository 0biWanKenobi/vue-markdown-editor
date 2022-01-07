import parser from './parser';
import createTipPlugin from '@/plugins/tip/index';

// style
import '@/assets/css/theme/base';
import '@/assets/css/theme/vuepress-markdown';

// tip plugin style
import '@/plugins/tip/tip.css';
import useEditor from '@/modules/useEditor';
import type { VMdParser } from '@/utils/v-md-parser';

const install = function (vMdParser: VMdParser, options: Record<string, any> | undefined) {
  const tipPlugin = createTipPlugin();
  const { editor: vMdEditor } = useEditor();

  vMdParser.use(parser, options);
  vMdEditor.use(tipPlugin);
};

export default {
  install,
};
