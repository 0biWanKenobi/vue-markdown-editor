import useCommand from '@/modules/useCommand';
import CreateToolbarParams from '@/types/createCommandType';
import Toolbar from '@/types/toolbarType';

const { execCommand } = useCommand();

export default function createToolbar({ commandName, text, title, icon }: CreateToolbarParams) {
  return {
    name: commandName,
    title,
    icon,
    text,
    action: () => {
      execCommand(commandName, { type: 'todo' });
    },
  } as Toolbar;
}
