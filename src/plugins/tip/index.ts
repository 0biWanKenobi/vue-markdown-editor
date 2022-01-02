import useCommand from '@/modules/useCommand';
import useCommon from '@/modules/useCommon';
import useLang from '@/modules/useLang';
import useToolbar from '@/modules/useToolbar';
import useVMdParser from '@/modules/useVMdParser';
import PluginCreatorFn from '@/types/pluginCreatorFn';
import parser from './parser';

const createTipPlugin: PluginCreatorFn = (
  param = {
    name: 'tip',
    icon: 'v-md-icon-tip',
    text: undefined,
  }
) => {
  const { name, icon, text } = param;
  const commandHandler = function (type = 'tip') {
    const { insert } = useCommon();
    insert((selected) => {
      const { langConfig } = useLang();
      const prefix = ':::';
      const suffix = ':::';
      const content = selected || langConfig.value.tip[type].placeholder;

      return {
        text: `${prefix} ${type}\n  ${content}\n${suffix}`,
        selected: content,
      };
    });
  };

  const { langConfig } = useLang();
  const { execCommand } = useCommand();

  const toolbar = {
    name,
    title: () => langConfig.value.tip.toolbar,
    icon,
    text,
    menus: [
      {
        name: 'tip',
        text: () => langConfig.value.tip.tip.toolbar,
        action() {
          execCommand(name);
        },
      },
      {
        name: 'warning',
        text: () => langConfig.value.tip.warning.toolbar,
        action() {
          execCommand(name, 'warning');
        },
      },
      {
        name: 'danger',
        text: () => langConfig.value.tip.danger.toolbar,
        action() {
          execCommand(name, 'danger');
        },
      },
      {
        name: 'details',
        text: () => langConfig.value.tip.details.toolbar,
        action() {
          execCommand(name, 'details');
        },
      },
    ],
  };

  return {
    install() {
      // if (VMdEditor.name === 'v-md-') {
      const { registerCommand, execCommand } = useCommand();
      const { registerToolbar } = useToolbar();
      registerCommand(name, commandHandler);
      registerToolbar(name, toolbar);
      const lang = useLang();

      lang.add({
        'zh-CN': {
          tip: {
            toolbar: '插入提示',
            tip: {
              toolbar: '提示',
              placeholder: '在此输入内容',
            },
            warning: {
              toolbar: '注意',
              placeholder: '在此输入内容',
            },
            danger: {
              toolbar: '警告',
              placeholder: '在此输入内容',
            },
            details: {
              toolbar: '详细信息',
              placeholder: '内容',
            },
          },
        },
        'en-US': {
          tip: {
            toolbar: 'Insert tip',
            tip: {
              toolbar: 'Tip',
              placeholder: 'Insert content',
            },
            warning: {
              toolbar: 'Warning',
              placeholder: 'Insert content',
            },
            danger: {
              toolbar: 'Danger',
              placeholder: 'Insert content',
            },
            details: {
              toolbar: 'Details',
              placeholder: 'Content',
            },
          },
        },
      });

      const vMdParser = useVMdParser();
      vMdParser.use(parser);
    },
  };
};
export default createTipPlugin;
