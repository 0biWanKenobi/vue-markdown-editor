import createPrismTheme from '@/theme/base/prism';
import type ThemeConfig from '@/types/themeConfigType';
import type Theme from '@/types/themeType';

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

  return <Theme>{
    previewClass: 'vuepress-markdown-body',
    extend(callback: Function) {
      prismTheme.extend(callback);
    },
    markdownParser: prismTheme.markdownParser,
  };
}
