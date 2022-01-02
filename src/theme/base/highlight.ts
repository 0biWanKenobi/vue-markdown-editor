import createBaseTheme from './base';
import { createHighlightRender } from '@/utils/markdown-it';
import ThemeConfig from '@/types/themeConfigType';
import MarkdownIt from 'markdown-it';

export default function createHljsTheme({
  Hljs,
  baseConfig,
  codeBlockClass,
  codeHighlightExtensionMap = {},
}: Partial<ThemeConfig> = {}) {
  const baseTheme = createBaseTheme(baseConfig);

  baseTheme.extend((md: MarkdownIt) => {
    md.set({
      highlight: createHighlightRender({
        codeHighlightExtensionMap,
        hasLang: (lang) => Hljs.getLanguage(lang),
        codeBlockClass,
        highlight: (str, lang) => Hljs.highlight(str, { language: lang }).value,
      }),
    });
  });

  return {
    previewClass: 'markdown-body',
    extend(callback: Function) {
      baseTheme.extend((...arg: any[]) => {
        callback(...arg);
      });
    },
    markdownParser: baseTheme.markdownParser,
  };
}
