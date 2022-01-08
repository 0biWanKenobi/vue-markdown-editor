import { reactive } from 'vue';
import { VMdParser } from '@/utils/v-md-parser';

let vMdParser: VMdParser;

export default () => {
  if (!vMdParser) {
    vMdParser = new VMdParser();
    vMdParser.lang.config = reactive(vMdParser.lang.config);
  }
  return vMdParser;
};
