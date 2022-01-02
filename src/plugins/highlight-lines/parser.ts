import PluginParserFn from '@/types/pluginParserFn';
import markdownItHighlightLines from '@/utils/markdown-it-highlight-lines';
import MarkdownIt from 'markdown-it';

const parser: PluginParserFn = (vMdParser) => {
  vMdParser.extendMarkdown((mdParser: MarkdownIt) => {
    mdParser.use(markdownItHighlightLines);
  });
};
export default parser;
