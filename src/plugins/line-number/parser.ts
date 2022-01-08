import PluginParserFn from '@/types/pluginParserFn';
import markdownItCodeLineNumber from '@vuepress/markdown/lib/lineNumbers.js';
import MarkdownIt from 'markdown-it';

const parser: PluginParserFn = function (vMdParser) {
  vMdParser.extendMarkdown((mdParser: MarkdownIt) => {
    mdParser.use(markdownItCodeLineNumber);
  });
};
export default parser;
