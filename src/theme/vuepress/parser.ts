import useVMdParser from '@/modules/useVMdParser';
import ThemeParserOpts from '@/types/themeParserOpts';
import createVuepressTheme from './theme';

export default function (options: ThemeParserOpts = {}) {
  const { extend, config, codeHighlightExtensionMap, Prism } = options;
  const theme = createVuepressTheme({
    Prism,
    baseConfig: config,
    codeHighlightExtensionMap,
  });

  if (extend) theme.extend(extend);
  const vMdParser = useVMdParser();
  vMdParser.theme(theme);
}
