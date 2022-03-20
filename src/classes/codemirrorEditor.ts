import IEditor from '@/interfaces/IEditor';
import Option from '@/types/OptionType';
import Install from '@/types/installType';
import { smooth } from '@/utils/smooth-scroll';

import { ref, SetupContext } from 'vue';

export const CodemirrorEditorSymbol = Symbol('CodemirrorEditor');

class CodemirrorEditor implements IEditor {
  type = CodemirrorEditorSymbol;
  text = ref('');
  ctx!: SetupContext;

  readonly codemirrorInstance = ref();

  constructor(ctx?: SetupContext<any>) {
    ctx && (this.ctx = ctx);
  }

  editorFocusEnd = () => {
    this.codemirrorInstance.value.focus();

    const lastLineIndex = this.codemirrorInstance.value.lastLine();
    const lastLineContent = this.codemirrorInstance.value.getLine(lastLineIndex);

    this.codemirrorInstance.value.setCursor({ line: lastLineIndex, ch: lastLineContent.length });
  };

  getCursorLineLeftText = () => {
    const { line: startLine, ch: startCh } = this.codemirrorInstance.value.getCursor('from');
    const { line: endLine, ch: endCh } = this.codemirrorInstance.value.getCursor('to');

    if (startLine !== endLine || startCh !== endCh) return;

    return this.codemirrorInstance.value.getLine(startLine).slice(0, startCh);
  };

  editorScrollToTop = (scrollTop: number) => {
    const currentScrollTop = this.getScrollInfo().top;

    smooth({
      currentScrollTop,
      scrollToTop: scrollTop,
      scrollFn: (scrollTop) => {
        this.codemirrorInstance.value.scrollTo(0, scrollTop);
      },
    });
  };

  getScrollInfo = () => {
    return this.codemirrorInstance.value.getScrollInfo();
  };

  heightAtLine = (...arg: any) => {
    return this.codemirrorInstance.value.heightAtLine(...arg);
  };

  focus = () => {
    this.codemirrorInstance.value.focus();
  };
  // Must implement
  undo = () => {
    this.codemirrorInstance.value.undo();
  };
  // Must implement
  redo = () => {
    this.codemirrorInstance.value.redo();
  };
  // Must implement
  clear = () => {
    this.codemirrorInstance.value.setValue('');
  };

  replaceSelectionText = (text: string, type = 'around') => {
    this.codemirrorInstance.value.replaceSelection(text, type);
  };

  getCurrentSelectedStr = () => {
    return this.codemirrorInstance.value.getSelection();
  };

  getIndexInInterval = (number: number, start: number, end: number) => {
    if (start <= number && number <= end) {
      return number - start;
    }
  };

  // Must implement
  changeSelectionTo = (selectedText: string) => {
    const curStartLine = this.codemirrorInstance.value.getCursor('from');
    const curEndLine = this.codemirrorInstance.value.getCursor('to');

    if (!selectedText) {
      this.codemirrorInstance.value.setSelection(curEndLine);
      return;
    }

    const lines = this.text.value?.split('\n').slice(curStartLine.line, curEndLine.line + 1);
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

    this.codemirrorInstance.value.setSelection(end, start);
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
