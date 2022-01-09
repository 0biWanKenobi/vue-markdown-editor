import BaseEditor from './base-editor.vue';
import CodeMirrorEditor from './codemirror-editor.vue';

export { BaseEditor, CodeMirrorEditor };

import Preview from './preview.vue';
import PreviewHtml from './preview-html.vue';

export { Preview, PreviewHtml };

import { Plugin } from 'vue';
import useLangModule from './modules/useLang';
import zhCNConfig from '@/lang/zh-CN';

import useToolbar from '@/modules/useToolbar';

import EditorConfig, { ThemeConfigOption } from '@/types/editorConfig';
import useCodemirror from '@/modules/useCodemirror';
import vuepressTheme from '@/theme/vuepress';
import githubTheme from '@/theme/github';
import useVMdParser from './modules/useVMdParser';
import useCommand from './modules/useCommand';
import useEditor from './modules/useEditor';

export { default as EditorConfig } from '@/types/editorConfig';

export * as EditorType from '@/types/editorType';
export const { use: useLang, add: addLang } = useLangModule();

/** PLUGINS */

export * as PluginCreatorParams from '@/types/pluginCreationFnParams';
export * as PluginCreatorFn from '@/types/pluginCreatorFn';
export * as Plugins from '@/plugins';

const configTheme = (configOption: ThemeConfigOption) => {
  const vMdParser = useVMdParser();
  switch (configOption.theme) {
    case 'github':
      githubTheme.install(vMdParser, configOption.config);
      return true;
    case 'vuepress':
      vuepressTheme.install(vMdParser, configOption.config);
      return true;
    default:
      console.error('Missing theme! Cannot configure');
      return false;
  }
};

const mdEditorPlugin: Plugin = {
  /**
   *
   * @param vue Vue instance
   * @param config {Object} markdown editor configuration
   */
  install: (vue, config: EditorConfig) => {
    const {
      langConfig,
      editor: { instance: editor, type: editorType },
      preview,
      themeConfig,
      Codemirror,
      plugins = [],
    } = config;
    useLang(langConfig.lang, langConfig.langConfig);
    addLang(zhCNConfig);

    if (!editor) return;

    vue.component(preview.name, preview);
    vue.component(editor.name, editor);

    const VmdEditor = useEditor(editorType);

    if (!themeConfig || !configTheme(themeConfig)) return;

    const { addDefaultCommands } = useCommand();
    addDefaultCommands();

    const { addDefaultToolbars } = useToolbar();
    addDefaultToolbars();

    for (const pluginConfig of plugins) {
      VmdEditor.editor.use(pluginConfig.plugin, pluginConfig.params);
    }

    if (Codemirror) {
      const codeMirrorSetup = useCodemirror();
      codeMirrorSetup.setValue(Codemirror);
    }
  },
};

export default mdEditorPlugin;
