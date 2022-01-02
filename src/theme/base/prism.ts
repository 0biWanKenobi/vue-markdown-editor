import createBaseTheme from './base';
import { createHighlightRender } from '@/utils/markdown-it';
import ThemeConfig from '@/types/themeConfigType';
import MarkdownIt from 'markdown-it';

export default function createPrismTheme({
  Prism,
  baseConfig,
  codeBlockClass,
  codeHighlightExtensionMap = {},
}: Partial<ThemeConfig> = {}) {
  const baseTheme = createBaseTheme(baseConfig);

  baseTheme.extend((md: MarkdownIt) => {
    md.set({
      highlight: createHighlightRender({
        codeHighlightExtensionMap,
        hasLang: (lang) => Prism.languages[lang],
        codeBlockClass,
        highlight: (str, lang) => Prism.highlight(str, Prism.languages[lang], lang),
      }),
    });
  });

  return {
    previewClass: 'markdown-body',
    extend(callback: Function) {
      baseTheme.extend((...arg: any) => {
        callback(...arg, Prism);
      });
    },
    markdownParser: baseTheme.markdownParser,
  };
}
