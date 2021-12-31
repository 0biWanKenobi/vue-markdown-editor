import BaseEditor from './base-editor';
import CodeMirrorEditor from './codemirror-editor';

import { DefineComponent, Plugin } from 'vue';
import EDITOR_TYPE, { BASE_EDITOR, CODEMIRROR_EDITOR } from '@/types/editorType';
import useLangModule from './modules/useLang';

export * as EditorType from '@/types/editorType';
export const { use: useLang, add: addLang } = useLangModule();

const mdEditorPlugin: Plugin = {
  install: (vue, type: EDITOR_TYPE) => {
    let component: DefineComponent<{}, {}, any>;
    switch (type) {
      case BASE_EDITOR:
        component = BaseEditor;
        break;
      case CODEMIRROR_EDITOR:
        component = CodeMirrorEditor;
      default:
        console.warn('Unsupported editor type. Choose either BASE_EDITOR or CODEMIRROR_EDITOR');
        break;
    }
    if (!component) return;

    vue.component(component.name, component);
  },
};

export default mdEditorPlugin;
