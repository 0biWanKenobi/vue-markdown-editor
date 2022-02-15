import IEditor from '@/interfaces/IEditor';
import Option from '@/types/OptionType';
import Install from '@/types/installType';
import { HotKey } from '@/types/hotKeyType';
import { smooth } from '@/utils/smooth-scroll';
import useText from '@/modules/useText';

import useCodemirror from '@/modules/useCodemirror';
import { SetupContext } from 'vue';

export const CodemirrorEditorSymbol = Symbol('CodemirrorEditor');

class CodemirrorEditor implements IEditor {
  type = CodemirrorEditorSymbol;
  textArea: any;
  ctx!: SetupContext;

  /**
   *
   */
  constructor(ctx?: SetupContext<any>) {
    ctx && (this.ctx = ctx);
  }

  editorFocusEnd = () => {
    const { codemirrorInstance } = useCodemirror();
    codemirrorInstance.value.focus();

    const lastLineIndex = codemirrorInstance.value.lastLine();
    const lastLineContent = codemirrorInstance.value.getLine(lastLineIndex);

    codemirrorInstance.value.setCursor({ line: lastLineIndex, ch: lastLineContent.length });
  };

  getCursorLineLeftText = () => {
    const { codemirrorInstance } = useCodemirror();
    const { line: startLine, ch: startCh } = codemirrorInstance.value.getCursor('from');
    const { line: endLine, ch: endCh } = codemirrorInstance.value.getCursor('to');

    if (startLine !== endLine || startCh !== endCh) return;

    return codemirrorInstance.value.getLine(startLine).slice(0, startCh);
  };

  editorRegisterHotkeys = (arg: HotKey) => {
    const { hotkeysManager } = useCodemirror();
    hotkeysManager.registerHotkeys(arg);
  };

  editorScrollToTop = (scrollTop: number) => {
    const currentScrollTop = this.getScrollInfo().top;

    smooth({
      currentScrollTop,
      scrollToTop: scrollTop,
      scrollFn: (scrollTop) => {
        const { codemirrorInstance } = useCodemirror();
        codemirrorInstance.value.scrollTo(0, scrollTop);
      },
    });
  };

  getScrollInfo = () => {
    const { codemirrorInstance } = useCodemirror();
    return codemirrorInstance.value.getScrollInfo();
  };

  heightAtLine = (...arg: any) => {
    const { codemirrorInstance } = useCodemirror();
    return codemirrorInstance.value.heightAtLine(...arg);
  };

  focus = () => {
    const { codemirrorInstance } = useCodemirror();
    codemirrorInstance.value.focus();
  };
  // Must implement
  undo = () => {
    const { codemirrorInstance } = useCodemirror();
    codemirrorInstance.value.undo();
  };
  // Must implement
  redo = () => {
    const { codemirrorInstance } = useCodemirror();
    codemirrorInstance.value.redo();
  };
  // Must implement
  clear = () => {
    const { codemirrorInstance } = useCodemirror();
    codemirrorInstance.value.setValue('');
  };

  replaceSelectionText = (text: string, type = 'around') => {
    const { codemirrorInstance } = useCodemirror();
    codemirrorInstance.value.replaceSelection(text, type);
  };

  getCurrentSelectedStr = () => {
    const { codemirrorInstance } = useCodemirror();
    return codemirrorInstance.value.getSelection();
  };

  getIndexInInterval = (number: number, start: number, end: number) => {
    if (start <= number && number <= end) {
      return number - start;
    }
  };

  // Must implement
  changeSelectionTo = (selectedText: string) => {
    const { codemirrorInstance } = useCodemirror();
    const curStartLine = codemirrorInstance.value.getCursor('from');
    const curEndLine = codemirrorInstance.value.getCursor('to');

    if (!selectedText) {
      codemirrorInstance.value.setSelection(curEndLine);
      return;
    }
    const { text } = useText();
    const lines = text.value?.split('\n').slice(curStartLine.line, curEndLine.line + 1);
    const startIndex = lines && lines.join('\n').indexOf(selectedText, curStartLine.ch);
    const endIndex = startIndex && startIndex + selectedText.length;

    type Position = {
      line: number;
      ch: number | null;
      indexOfSelected: number | undefined;
    };

    const start: Position = {
      line: 0,
      ch: null,
      indexOfSelected: startIndex,
    };
    const end: Position = {
      line: 0,
      ch: null,
      indexOfSelected: endIndex,
    };

    let strLen = 0;
    lines &&
      lines.find((rowText, lineIndex) => {
        const rowLength = rowText.length;

        [start, end].forEach((position) => {
          const newCursor =
            position.indexOfSelected &&
            this.getIndexInInterval(position.indexOfSelected, strLen, strLen + rowLength);

          if (typeof newCursor !== 'undefined' && position.ch) {
            position.ch = newCursor;
            position.line = curStartLine.line + lineIndex;
          }
        });

        // + 1 是算上换行符占的长度
        strLen += rowLength + 1;

        return start.ch !== null && end.ch !== null;
      });

    codemirrorInstance.value.setSelection(end, start);
  };

  use(optionsOrInstall: Option | Install, opt?: any) {
    if (typeof optionsOrInstall === 'function') {
      optionsOrInstall(opt);
    } else {
      (<Install>optionsOrInstall).install(opt);
    }
    return this;
  }
}

export default CodemirrorEditor;
