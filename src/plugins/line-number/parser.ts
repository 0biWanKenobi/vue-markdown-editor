import PluginParserFn from '@/types/pluginParserFn';
const markdownItCodeLineNumber = require('@vuepress/markdown');
import MarkdownIt from 'markdown-it';

const parser: PluginParserFn = function (vMdParser) {
  vMdParser.extendMarkdown((mdParser: MarkdownIt) => {
    mdParser.use(markdownItCodeLineNumber);
  });
};
export default parser;
