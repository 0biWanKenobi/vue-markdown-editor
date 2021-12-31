import IEditor from '@/interfaces/IEditor';
import { Ref } from 'vue';

class CodemirrorEditor implements IEditor {
  editorEngineEl: Ref<any>;
  previewScrollerEl: Ref<any>;
  previewEl: Ref<any>;
  editorFocusEnd: () => void;
  getCursorLineLeftText: () => string;
  editorRegisterHotkeys: (...arg: any[]) => void;
  editorScrollToTop: (scrollTop: number) => void;
  getScrollInfo: () => { clientHeight: number; top: number; height: number };
  heightAtLine: (...arg: any[]) => number;
  focus: () => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
  replaceSelectionText: (text: string, replacement?: string) => void;
  getCurrentSelectedStr: () => string;
  changeSelectionTo: (insertText: string, selectedText: string) => void;
}

export default CodemirrorEditor;
