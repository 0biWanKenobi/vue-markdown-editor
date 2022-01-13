import parser from './parser';

// style
import '@/assets/css/theme/base';
import '@/assets/css/theme/github-markdown';
import ThemeInstallFn from '@/types/themeInstallFnType';

const install: ThemeInstallFn = function (vMdParser, options) {
  vMdParser.use(parser, options);
};

export default {
  install,
};
