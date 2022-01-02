import createPrismTheme from '@/theme/base/prism';
import ThemeConfig from '@/types/themeConfigType';

export default function createVuepressTheme(config: ThemeConfig) {
  const prismTheme = createPrismTheme({
    Prism: config.Prism,
    codeHighlightExtensionMap: config.codeHighlightExtensionMap || {},
    codeBlockClass: config.codeBlockClass || ((lang: string) => `v-md-prism-${lang}`),
    baseConfig: {
      link: {
        openLinkIcon: true,
      },
      ...config.baseConfig,
    },
  });

  return {
    previewClass: 'vuepress-markdown-body',
    extend(callback: Function) {
      prismTheme.extend(callback);
    },
    markdownParser: prismTheme.markdownParser,
  };
}
