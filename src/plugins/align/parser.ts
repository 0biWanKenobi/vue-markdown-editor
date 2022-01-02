import PluginParserFn from '@/types/pluginParserFn';
import markdownItContainer from '@/utils/markdown-it-container';
import MarkdownIt from 'markdown-it';

const parser: PluginParserFn = (vMdParser) => {
  vMdParser.extendMarkdown((mdParser: MarkdownIt) => {
    markdownItContainer(mdParser, {
      type: 'align-left',
      defaultTitle: '',
      before: (info?: string) => `<div align="left">${info || ''}\n`,
      after: () => '</div>\n',
    });

    markdownItContainer(mdParser, {
      type: 'align-center',
      defaultTitle: '',
      before: (info?: string) => `<div align="center">${info || ''}\n`,
      after: () => '</div>\n',
    });

    markdownItContainer(mdParser, {
      type: 'align-right',
      defaultTitle: '',
      before: (info?: string) => `<div align="right">${info || ''}\n`,
      after: () => '</div>\n',
    });
  });
};
export default parser;
