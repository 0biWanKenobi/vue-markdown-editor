import Option from '@/types/OptionType';
import Install from '@/types/installType';
import type TextArea from '@/classes/textArea';

interface IEditor {
  textArea: TextArea | undefined;
  type: Symbol;
  editorFocusEnd: () => void;
  getCursorLineLeftText: () => string | null;
  editorRegisterHotkeys: (...arg: any[]) => void;
  editorScrollToTop: (scrollTop: number) => void;
  getScrollInfo: () => {
    clientHeight: number;
    top: number;
    height: number;
  };
  heightAtLine: (...arg: any[]) => number;
  focus: () => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
  replaceSelectionText: (text: string, replacement?: string) => void;
  getCurrentSelectedStr: () => string | undefined;
  changeSelectionTo: (insertText: string, selectedText: string | undefined) => void;
  // plugin / theme installer
  use: (optionsOrInstall: Option | Install, opt?: any) => IEditor;
}

export default IEditor;
