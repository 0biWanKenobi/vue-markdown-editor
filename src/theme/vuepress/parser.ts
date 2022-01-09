import ThemeParserOpts from '@/types/themeParserOpts';
import type { VMdParser } from '@/utils/v-md-parser';
import createVuepressTheme from './theme';

export default function (parser: VMdParser, options: ThemeParserOpts = {}) {
  const { extend, config, codeHighlightExtensionMap, Prism } = options;
  const theme = createVuepressTheme({
    Prism,
    baseConfig: config,
    codeHighlightExtensionMap,
  });

  if (extend) theme.extend(extend);
  parser.theme(theme);
}
