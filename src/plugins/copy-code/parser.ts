import PluginParserFn from '@/types/pluginParserFn';
import markdownItCopyCode from '@/utils/markdown-it-copy-code';
import MarkdownIt from 'markdown-it';

const parser: PluginParserFn = (vMdParser) => {
  vMdParser.extendMarkdown((mdParser: MarkdownIt) => {
    mdParser.use(markdownItCopyCode);
  });
};

export default parser;
