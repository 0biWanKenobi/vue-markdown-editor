import PluginParserFn from '@/types/pluginParserFn';
import markdownItKatex from '@/utils/markdown-it-katex';
import Katex from 'katex';
import MarkdownIt from 'markdown-it';

export default function parserCreator(katex?: typeof Katex) {
  const parser: PluginParserFn = (vMdParser, katexOptions) => {
    vMdParser.extendMarkdown((mdParser: MarkdownIt) => {
      if (katex) {
        mdParser.use(markdownItKatex, {
          ...katexOptions,
          katex,
        });
      }
    });
  };
  return parser;
}
