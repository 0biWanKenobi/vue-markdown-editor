import createToolbar from './toolbar';
import commandHandler from './command';
import parser from './parser';
import useLang from '@/modules/useLang';
import useCommand from '@/modules/useCommand';
import useToolbar from '@/modules/useToolbar';
import useVMdParser from '@/modules/useVMdParser';
import PluginCreatorFn from '@/types/pluginCreatorFn';

const createTodoListPlugin: PluginCreatorFn = (
  params = {
    name: 'todo-list',
    icon: 'v-md-icon-checkbox',
  }
) => {
  const { name, icon, text, color } = params;
  const toolbar = createToolbar({
    commandName: name!,
    title: () => {
      const { langConfig } = useLang();
      return `${langConfig.value.task.toolbar}（Ctrl+Shift+U）`;
    },
    text,
    icon: icon!,
  });

  return {
    install(state) {
      //if (VMdEditor.name === 'v-md-editor') {
      const { registerCommand, execCommand } = useCommand();
      const { addToolbar } = useToolbar();
      const lang = useLang();

      registerCommand(name!, commandHandler);
      addToolbar(toolbar);
      state.hotkeysManager.registerHotkeys({
        modifier: 'ctrlShift',
        key: 'u',
        action() {
          execCommand(name!, state);
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
