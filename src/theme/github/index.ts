import parser from './parser';

// style
import '@/assets/css/theme/base';
import '@/assets/css/theme/github-markdown';
import useVMdParser from '@/modules/useVMdParser';

const install = function (options: Record<string, any> | undefined) {
  const vMdParser = useVMdParser();
  vMdParser.use(parser, options);
};

export default {
  install,
};
