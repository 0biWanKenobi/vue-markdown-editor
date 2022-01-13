import type { Plugin } from 'vue';
import useLangModule from './modules/useLang';
import { CN } from '@/lang/index';

import useToolbar from '@/modules/useToolbar';

import EditorConfig, { ThemeConfigOption } from '@/types/editorConfig';
import useCodemirror from '@/modules/useCodemirror';

import useVMdParser from './modules/useVMdParser';
import useCommand from './modules/useCommand';
import useEditor from './modules/useEditor';

export { default as EditorConfig } from '@/types/editorConfig';
export * as EditorType from '@/types/editorType';
export * as PluginCreatorParams from '@/types/pluginCreationFnParams';
export * as PluginCreatorFn from '@/types/pluginCreatorFn';

const { use: useLang, add: addLang } = useLangModule();

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

declare global {
  var Vue: any;
  interface Window {
    Vue: any;
  }
}

// auto install

let GlobalVue: any = null;
if (typeof window !== 'undefined' && window.Vue) {
  GlobalVue = window.Vue;
} else if (typeof global !== 'undefined' && global.Vue) {
  GlobalVue = global.Vue;
}
if (GlobalVue) {
  GlobalVue.use(mdEditorPlugin);
}

export default mdEditorPlugin;
