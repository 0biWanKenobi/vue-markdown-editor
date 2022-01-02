import createHljsTheme from '@/theme/base/highlight';
import ThemeConfig from '@/types/themeConfigType';

export default function createGithubTheme(config: ThemeConfig) {
  const hljsTheme = createHljsTheme({
    Hljs: config.Hljs,
    baseConfig: config.baseConfig,
    codeBlockClass: config.codeBlockClass || ((lang: string) => `v-md-hljs-${lang}`),
    codeHighlightExtensionMap: config.codeHighlightExtensionMap || {},
  });

  return {
    previewClass: 'github-markdown-body',
    extend(callback: Function) {
      hljsTheme.extend(callback);
    },
    markdownParser: hljsTheme.markdownParser,
  };
}
