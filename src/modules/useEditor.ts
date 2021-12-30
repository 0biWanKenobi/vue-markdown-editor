import IEditor from '@/interfaces/IEditor';
import BaseEditor from './useBaseEditor';
import CodeMirrorEditor from './useCodemirrorEditor';
import { ref } from 'vue';

const BASE_EDITOR = 'base';
const CODEMIRROR_EDITOR = 'codemirror';

type EDITOR_TYPE = typeof BASE_EDITOR | typeof CODEMIRROR_EDITOR;

const DEFAULT_EDITOR = BASE_EDITOR;

const editorMap = {
  [BASE_EDITOR]: BaseEditor,
  [CODEMIRROR_EDITOR]: CodeMirrorEditor,
};

const currentEditor = ref<IEditor>();

export default (editorType: EDITOR_TYPE = DEFAULT_EDITOR) => {
  if (currentEditor.value)
    return {
      editor: currentEditor.value,
    };

  currentEditor.value = editorMap[editorType]();

  return {
    editor: currentEditor.value,
  };
};
