// base css
import '@/styles/index.scss';

import VueTypes, { string, instanceOf, object } from 'vue-types';

import EDITOR_MODE from '@/utils/constants/editor-mode';
import EDITOR_MODE_TYPE from '@/types/editorMode';
import CodeMirrorCfg from '@/types/codeMirrorCfgType';

const rootProps = {
  theme: Object,
  mode: string<EDITOR_MODE_TYPE>().def(EDITOR_MODE.EDITABLE),
  editorType: string<'base' | 'codemirror'>().def('base'),
  tocNavPositionRight: Boolean,
  autofocus: Boolean,
  beforePreviewChange: instanceOf(Function).def((text: any, next: any) => {
    next(text);
  }),
};

export const codemirrorEditorProps = {
  tabSize: VueTypes.number.def(2),
  codemirrorConfig: object<CodeMirrorCfg | {}>().def({}),
  codemirrorStyleReset: VueTypes.bool.def(true),
};

export const baseEditorProps = {
  height: String,
};

export const sharedEditorProps = {
  placeholder: String,
};

export const editorProps = {
  ...rootProps,
  ...sharedEditorProps,
  ...codemirrorEditorProps,
  ...baseEditorProps,
};

export const editorEmits = ['blur', 'change', 'save', 'image-click'];

export const shouldInheritAttrs = false;
