import EDITOR_MODE_TYPE from '@/types/editorMode';

const EditorMode: Record<string, EDITOR_MODE_TYPE> = {
  PREVIEW: 'preview',
  EDITABLE: 'editable',
  EDIT: 'edit',
};

export default EditorMode;
