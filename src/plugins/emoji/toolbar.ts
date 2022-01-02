import useCommand from '@/modules/useCommand';
import CreateToolbarParams from '@/types/createCommandType';

function generatorMenuItems(emojiJson: any, commandName: string) {
  const { execCommand } = useCommand();
  return Object.keys(emojiJson).map((emojiType) => ({
    name: emojiType,
    text: emojiJson[emojiType],
    class: 'v-md-emoji-panel-item',
    action() {
      execCommand(commandName, emojiType);
    },
  }));
}

export default function createToolbar({
  commandName,
  emojiJson,
  text,
  title,
  icon,
}: CreateToolbarParams) {
  return {
    name: commandName,
    title,
    icon,
    text,
    menus: {
      mode: 'panel',
      items: generatorMenuItems(emojiJson, commandName),
    },
  };
}
