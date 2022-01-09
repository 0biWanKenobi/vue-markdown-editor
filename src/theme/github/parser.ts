import ThemeParserOpts from '@/types/themeParserOpts';
import type { VMdParser } from '@/utils/v-md-parser';
import createGithubTheme from './theme';

export default function (parser: VMdParser, options: ThemeParserOpts = {}) {
  const { extend, config, codeHighlightExtensionMap, Hljs } = options;
  const theme = createGithubTheme({
    Hljs,
    baseConfig: config,
    codeHighlightExtensionMap,
  });

  if (extend) theme.extend(extend);
  parser.theme(theme);
}
