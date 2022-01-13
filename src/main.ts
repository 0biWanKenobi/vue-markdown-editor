import BaseEditor from './base-editor.vue';
import CodeMirrorEditor from './codemirror-editor.vue';

export { BaseEditor, CodeMirrorEditor };

import Preview from './preview.vue';
import PreviewHtml from './preview-html.vue';

export { Preview, PreviewHtml };

import type { Plugin } from 'vue';
import useLangModule from './modules/useLang';
import { CN } from '@/lang/index';

export * as Languages from '@/lang/index';

import useToolbar from '@/modules/useToolbar';

import EditorConfig, { ThemeConfigOption } from '@/types/editorConfig';
import useCodemirror from '@/modules/useCodemirror';

import useVMdParser from './modules/useVMdParser';
import useCommand from './modules/useCommand';
import useEditor from './modules/useEditor';

export { default as EditorConfig } from '@/types/editorConfig';

export * as EditorType from '@/types/editorType';
const { use: useLang, add: addLang } = useLangModule();

/** PLUGINS */

export * as PluginCreatorParams from '@/types/pluginCreationFnParams';
export * as PluginCreatorFn from '@/types/pluginCreatorFn';
export * as Plugins from '@/plugins';

const configTheme = (configOption: ThemeConfigOption) => {
  const vMdParser = useVMdParser();
  configOption.theme.install(vMdParser, configOption.config);
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

    langConfig && useLang(langConfig.lang, langConfig.langConfig);
    addLang(CN);

    if (!editor) return;

    vue.component(preview.name, preview);
    vue.component(editor.name, editor);

    const VmdEditor = useEditor(editorType);

    if (!themeConfig) return;
    configTheme(themeConfig);

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
