import type { Plugin } from 'vue';
import { ref } from 'vue';
import '@/assets/css/font.css';
import useLangModule from './modules/useLang';
import { CN } from '@/lang/index';

import EditorConfig from '@/types/editorConfig';

import useCommand from './modules/useCommand';

const { use: useLang, add: addLang } = useLangModule();

const commandsConfigured = ref(false);
const configure = (config: EditorConfig) => {
  const { langConfig } = config;

  langConfig && useLang(langConfig.lang, langConfig.langConfig);
  addLang(CN);

  if (!commandsConfigured.value) {
    const { addDefaultCommands } = useCommand();
    addDefaultCommands();
    commandsConfigured.value = true;
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
