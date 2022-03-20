import IEditor from '@/interfaces/IEditor';
import Option from '@/types/OptionType';
import Install from '@/types/installType';
import TextArea from './textArea';
import { ref, SetupContext } from 'vue';
import ScrollBar from './scrollBar';

export const BaseEditorSymbol = Symbol('BaseEditor');

class BaseEditor implements IEditor {
  type = BaseEditorSymbol;
  text = ref('');

  private _textArea: TextArea;
  public get textArea() {
    return this._textArea;
  }

  private _scrollBar = new ScrollBar('editor');
  public get scrollBar() {
    return this._scrollBar;
  }

  private ctx!: SetupContext<any>;

  constructor(ctx: SetupContext<any>) {
    this.ctx = ctx;
    this._textArea = new TextArea(ctx);
  }

  editorFocusEnd = () => {
    const { setRange } = this.textArea;
    this.focus();
    setRange({
      start: this.text.value?.length ?? 0,
      end: this.text.value?.length ?? 0,
    });
  };

  getCursorLineLeftText = () => {
    const { getRange } = this.textArea;
    const { start, end } = getRange();
    return start === end ? this.text.value?.slice(0, start).split('\n').pop() ?? null : null;
  };

  editorScrollToTop = (scrollTop: number) => {
    const { scrollTo } = this.scrollBar;
    scrollTo(scrollTop);
  };

  getScrollInfo = () => {
    const { getScrollInfo } = this.scrollBar;
    return getScrollInfo();
  };

  heightAtLine: (...arg: any[]) => number = (...arg) => {
    const { heightAtLine } = this.textArea;
    return heightAtLine(arg[0]);
  };

  focus = () => {
    this.textArea.focus();
  };

  undo = () => {
    const { undo } = this.textArea;
    const oldVal = undo();
    oldVal && this.ctx.emit('update:modelValue', oldVal);
  };

  redo = () => {
    const { redo } = this.textArea;
    const oldVal = redo();
    oldVal && this.ctx.emit('update:modelValue', oldVal);
  };

  clear = () => {
    this.focus();
    this.text.value = '';
    this.ctx.emit('update:modelValue', '');
  };

  replaceSelectionText = (text: string) => {
    const { insertText } = this.textArea;
    insertText(text);
  };

  getCurrentSelectedStr = () => {
    const { getRange } = this.textArea;
    const { start, end } = getRange();
    return end > start ? this.text.value?.slice(start, end) ?? undefined : undefined;
  };

  changeSelectionTo = (insertText: string, selectedText: string | undefined) => {
    const { getRange, setRange } = this.textArea;
    const selectedIndexOfStr = selectedText ? insertText.indexOf(selectedText) : -1;
    const cursorEndIndex = getRange().end;

    if (!selectedText || selectedIndexOfStr === -1) return;

    const textSliced = this.text.value?.slice(0, cursorEndIndex) ?? '';
    const insertTextIndex = textSliced.length - insertText.length;
    const rangeStartIndex = insertTextIndex + selectedIndexOfStr;
    const rangeEndIndex = rangeStartIndex + selectedText.length;

    setRange({
      start: rangeStartIndex,
      end: rangeEndIndex,
    });
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

export default BaseEditor;
