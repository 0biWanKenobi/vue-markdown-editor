import MarkdownIt from 'markdown-it';
import { escapeHtml } from 'markdown-it/lib/common/utils';

const defaults = {
  codeHighlightExtensionMap: <Record<string, string>>{},
  hasLang: (_: string) => true,
  highlight: (str: string, _?: string) => str,
};

type Options = {
  codeHighlightExtensionMap: Record<string, string>;
  hasLang: (name: string) => boolean;
  highlight: ((str: string) => string) | ((str: string, lang: string) => string);
  codeBlockClass?: (v: string) => string;
};

// type Options = typeof defaults & { codeBlockClass?: (v: string) => string };

export function createHighlightRender({
  codeHighlightExtensionMap,
  hasLang,
  highlight,
  codeBlockClass,
}: Options = defaults) {
  const getCodeBlockClass = (lang: string) =>
    codeBlockClass ? codeBlockClass(lang) : `language-${lang}`;

  return function (str: string, lang: string) {
    let res = escapeHtml(str);

    lang = codeHighlightExtensionMap[lang] || lang;

    if (lang) {
      if (hasLang(lang)) {
        res = highlight(str, lang);
      }
    }

    return `<pre class="${getCodeBlockClass(lang)}"><code>${res}</code></pre>`;
  };
}

export default function () {
  const markdownItInstance = new MarkdownIt();

  markdownItInstance.set({
    html: true,
    breaks: true,
    linkify: false,
    typographer: true,
  });

  return markdownItInstance;
}
