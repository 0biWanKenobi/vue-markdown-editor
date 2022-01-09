import { VMdParser } from '@/utils/v-md-parser';

type PluginParserFn = (vMdParser: VMdParser, options?: Record<string, any>) => void;

export default PluginParserFn;
