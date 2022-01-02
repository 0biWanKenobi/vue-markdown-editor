import createToolbar from './toolbar';
import commandHandler from './command';
import parser from './parser';
import useLang from '@/modules/useLang';
import useCommand from '@/modules/useCommand';
import useToolbar from '@/modules/useToolbar';
import useHotkeys from '@/modules/useHotkeys';
import useVMdParser from '@/modules/useVMdParser';
import PluginCreatorFn from '@/types/pluginCreatorFn';

const createTodoListPlugin: PluginCreatorFn = ({
  name = 'todo-list',
  icon = 'v-md-icon-checkbox',
  text,
  color,
}) => {
  const toolbar = createToolbar({
    commandName: name,
    title: () => {
      const { langConfig } = useLang();
      return `${langConfig.value.task.toolbar}（Ctrl+Shift+U）`;
    },
    text,
    icon,
  });

  return {
    install() {
      //if (VMdEditor.name === 'v-md-editor') {
      const { registerCommand, execCommand } = useCommand();
      const { registerToolbar } = useToolbar();
      const { registerHotkeys } = useHotkeys();
      const lang = useLang();

      registerCommand(name, commandHandler);
      registerToolbar(name, toolbar);
      registerHotkeys({
        modifier: 'ctrlShift',
        key: 'u',
        action() {
          execCommand(name);
        },
      });
      lang.add({
        'zh-CN': {
          task: {
            toolbar: '任务列表',
            placeholder: '任务列表',
          },
        },
        'en-US': {
          task: {
            toolbar: 'Task',
            placeholder: 'Task',
          },
        },
      });

      const vMdParser = useVMdParser();
      vMdParser.use(parser, {
        color,
      });
    },
  };
};

export default createTodoListPlugin;
