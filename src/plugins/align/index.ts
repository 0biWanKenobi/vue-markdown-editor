import useVMdParser from '@/modules/useVMdParser';
import parser from './parser';

export default function () {
  return {
    install() {
      const vMdParser = useVMdParser();
      vMdParser.use(parser);
    },
  };
}
