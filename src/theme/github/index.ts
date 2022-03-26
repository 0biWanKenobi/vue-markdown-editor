import parser from './parser';

// style
import '@/assets/css/theme/base.css';
import '@/assets/css/theme/github-markdown.css';
import ThemeInstallFn from '@/types/themeInstallFnType';

const install: ThemeInstallFn = function (state, options) {
  state.parser.use(parser, options);
};

export default {
  install,
};
