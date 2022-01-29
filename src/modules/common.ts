// base css
import '@/styles/index.scss';

import VueTypes, { string, instanceOf } from 'vue-types';

import EDITOR_MODE from '@/utils/constants/editor-mode';
import EDITOR_MODE_TYPE from '@/types/editorMode';

export const editorProps = {
  height: String,
  theme: Object,
  mode: string<EDITOR_MODE_TYPE>().def(EDITOR_MODE.EDITABLE),
  autofocus: Boolean,
  placeholder: String,
  tocNavPositionRight: Boolean,
  tabSize: VueTypes.number.def(2),
  beforePreviewChange: instanceOf(Function).def((text: any, next: any) => {
    next(text);
  }),
};

export const editorEmits = ['blur', 'change', 'save', 'image-click'];

export const shouldInheritAttrs = false;
