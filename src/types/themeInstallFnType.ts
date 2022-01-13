import type { VMdParser } from '@/utils/v-md-parser';

type ThemeInstallFn = (vMdParser: VMdParser, options: Record<string, any> | undefined) => void;

export default ThemeInstallFn;
