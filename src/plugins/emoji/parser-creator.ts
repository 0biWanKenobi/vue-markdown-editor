import PluginParserFn from '@/types/pluginParserFn';
import MarkdownIt from 'markdown-it';

export default function parserCreator(mdEmojiPlugin: any) {
  const parser: PluginParserFn = function (vMdParser, options = {}) {
    vMdParser.extendMarkdown((mdParser: MarkdownIt) => {
      // extend markdown-it
      mdParser.use(mdEmojiPlugin);

      if (options.customEmoji) {
        mdParser.renderer.rules.emoji = function (token, idx) {
          return '<span class="v-md-emoji emoji-' + token[idx].markup + '"></span>';
        };
      }
    });
  };

  return parser;
}
