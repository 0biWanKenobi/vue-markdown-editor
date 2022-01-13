import parser from './parser';
import createTipPlugin from '@/plugins/tip/index';

// style
import '@/assets/css/theme/base';
import '@/assets/css/theme/vuepress-markdown';

// tip plugin style
import '@/plugins/tip/tip.css';
import useEditor from '@/modules/useEditor';
import ThemeInstallFn from '@/types/themeInstallFnType';

const install: ThemeInstallFn = function (vMdParser, options) {
  const tipPlugin = createTipPlugin();
  const { editor: vMdEditor } = useEditor();

  vMdParser.use(parser, options);
  vMdEditor.use(tipPlugin);
};

export default {
  install,
};
