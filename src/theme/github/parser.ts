import useVMdParser from '@/modules/useVMdParser';
import ThemeParserOpts from '@/types/themeParserOpts';
import createGithubTheme from './theme';

export default function (options: ThemeParserOpts = {}) {
  const { extend, config, codeHighlightExtensionMap, Hljs } = options;
  const theme = createGithubTheme({
    Hljs,
    baseConfig: config,
    codeHighlightExtensionMap,
  });

  if (extend) theme.extend(extend);
  const vMdParser = useVMdParser();
  vMdParser.theme(theme);
}
