import type { Plugin } from 'vue';
import { ref } from 'vue';
import '@/assets/css/font.css';
import useLangModule from './modules/useLang';
import { CN } from '@/lang/index';

import EditorConfig, { ThemeConfigOption } from '@/types/editorConfig';
import useCodemirror from '@/modules/useCodemirror';

import useVMdParser from './modules/useVMdParser';
import useEditor from './modules/useEditor';
import useCommand from './modules/useCommand';
import useToolbar from './modules/useToolbar';

const { use: useLang, add: addLang } = useLangModule();

const configTheme = (configOption: ThemeConfigOption) => {
  const vMdParser = useVMdParser();
  configOption.theme.install(vMdParser, configOption.config);
};

const commandsConfigured = ref(false);
const toolbarsConfigured = ref(false);

const configure = (config: EditorConfig) => {
  const {
    langConfig,
    editor: { type: editorType },
    themeConfig,
    Codemirror,
    plugins = [],
  } = config;

  langConfig && useLang(langConfig.lang, langConfig.langConfig);
  addLang(CN);

  const VmdEditor = useEditor(editorType);

  if (!themeConfig) return false;
  configTheme(themeConfig);

  if (!commandsConfigured.value) {
    const { addDefaultCommands } = useCommand();
    addDefaultCommands();
    commandsConfigured.value = true;
  }

  if (!toolbarsConfigured.value) {
    const { addDefaultToolbars } = useToolbar();
    addDefaultToolbars();
    toolbarsConfigured.value = true;
  }

  for (const pluginConfig of plugins) {
    VmdEditor.editor.use(pluginConfig.plugin, pluginConfig.params);
  }

  if (Codemirror) {
    useCodemirror(Codemirror);
  }

  return true;
};

const mdEditorPlugin: Plugin = {
  /**
   *
   * @param _ Vue instance
   * @param config {Object} markdown editor configuration
   */
  install: (_, config: EditorConfig) => {
    configure(config);
  },
};

export { configure };
export default mdEditorPlugin;
