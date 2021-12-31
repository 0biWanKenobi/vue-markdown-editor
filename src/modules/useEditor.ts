import IEditor from '@/interfaces/IEditor';
import { ref } from 'vue';
import EDITOR_TYPE, { BASE_EDITOR, CODEMIRROR_EDITOR } from '@/types/editorType';
import BaseEditor from '@/classes/baseEditor';
import CodemirrorEditor from '@/classes/codemirrorEditor';

const DEFAULT_EDITOR = BASE_EDITOR;

const editorMap: Record<string, () => IEditor> = {
  [BASE_EDITOR]: () => new BaseEditor(),
  [CODEMIRROR_EDITOR]: () => new CodemirrorEditor(),
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
