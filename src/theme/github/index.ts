import parser from './parser';

// style
import '@/assets/css/theme/base';
import '@/assets/css/theme/github-markdown';
import type { VMdParser } from '@/utils/v-md-parser';

const install = function (vMdParser: VMdParser, options: Record<string, any> | undefined) {
  vMdParser.use(parser, options);
};

export default {
  install,
};
