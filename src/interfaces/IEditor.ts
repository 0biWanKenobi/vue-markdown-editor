interface IEditor {
  editorFocusEnd: () => void;
  delLineLeft: () => void;
  getCursorLineLeftText: () => void;
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
  replaceSelectionText: (text: string) => void;
  getCurrentSelectedStr: () => string;
  changeSelectionTo: (insertText: string, selectedText: string) => void;
}

export default IEditor;
