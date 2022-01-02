import PluginParserFn from '@/types/pluginParserFn';
import markdownItMermaid from '@/utils/markdown-it-mermaid';
import MarkdownIt from 'markdown-it';

const parser: PluginParserFn = (vMdParser) => {
  vMdParser.extendMarkdown((mdParser: MarkdownIt) => {
    if (mdParser) {
      mdParser.use(markdownItMermaid);
    }
  });
};

export default parser;
