import parser from './parser';
import createTipPlugin from '@/plugins/tip/index';

// style
import '@/assets/css/theme/base.css';
import '@/assets/css/theme/vuepress-markdown.css';

// tip plugin style
import '@/plugins/tip/tip.css';
import ThemeInstallFn from '@/types/themeInstallFnType';

const install: ThemeInstallFn = function (state, options) {
  const tipPlugin = createTipPlugin();

  state.parser.use(parser, options);
  state.use(tipPlugin);
};

export default {
  install,
};
