import createToolbar from './toolbar';
import commandHandler from './command';
import useCommand from '@/modules/useCommand';
import useLang from '@/modules/useLang';
import PluginCreatorFn from '@/types/pluginCreatorFn';

export default function creator({ emojiJson, parser }: { emojiJson: any; parser: any }) {
  const createEmojiPlugin: PluginCreatorFn = (
    params = {
      name: 'emoji',
      icon: 'v-md-icon-emoji',
      title: () => useLang().langConfig.value.emoji,
      customEmoji: undefined,
    }
  ) => {
    const { name, title, text, icon, customEmoji } = params;
    const toolbar = createToolbar({
      commandName: name!,
      title: title!,
      text,
      icon: icon!,
      emojiJson,
    });

    return {
      install(state) {
        const { registerCommand } = useCommand();
        registerCommand(name!, commandHandler);

        const { addToolbar } = state.toolbarManager;
        addToolbar(toolbar);

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

        state.parser.use(parser, {
          customEmoji,
          state,
        });
      },
    };
  };

  return createEmojiPlugin;
}
