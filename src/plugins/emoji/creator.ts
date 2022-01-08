import createToolbar from './toolbar';
import commandHandler from './command';
import useCommand from '@/modules/useCommand';
import useToolbar from '@/modules/useToolbar';
import useLang from '@/modules/useLang';
import useVMdParser from '@/modules/useVMdParser';
import PluginCreatorFn from '@/types/pluginCreatorFn';

export default function creator({ emojiJson, parser }: { emojiJson: any; parser: any }) {
  const createEmojiPlugin: PluginCreatorFn = ({
    name = 'emoji',
    icon = 'v-md-icon-emoji',
    text,
    title = () => useLang().langConfig.value.emoji,
    customEmoji,
  }) => {
    const toolbar = createToolbar({ commandName: name, title, text, icon, emojiJson });

    return {
      install() {
        // if (VMdEditor.name === 'v-md-editor') {
        const { registerCommand } = useCommand();
        registerCommand(name!, commandHandler);

        const { registerToolbar } = useToolbar();
        registerToolbar(name, toolbar);

        const lang = useLang();
        lang.add({
          'zh-CN': {
            emoji: '插入emoji表情',
          },
          'en-US': {
            emoji: 'Insert emoji',
          },
        });
        // }

        const vMdParser = useVMdParser();
        vMdParser.use(parser, {
          customEmoji,
        });
      },
    };
  };

  return createEmojiPlugin;
}
