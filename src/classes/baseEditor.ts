import IEditor from '@/interfaces/IEditor';
import Option from '@/types/OptionType';
import Install from '@/types/installType';
import useText from '@/modules/useText';
import TextArea from './textArea';
import { SetupContext } from 'vue';
import ScrollBar from './scrollBar';

export const BaseEditorSymbol = Symbol('BaseEditor');

class BaseEditor implements IEditor {
  type = BaseEditorSymbol;
  private _textArea = new TextArea();
  public get textArea() {
    return this._textArea;
  }

  private _scrollBar = new ScrollBar('editor');
  public get scrollBar() {
    return this._scrollBar;
  }

  private ctx!: SetupContext<any>;

  /**
   *
   */
  constructor(ctx?: SetupContext<any>) {
    ctx && (this.ctx = ctx);
  }

  editorFocusEnd = () => {
    const { focus, setRange } = this.textArea;
    focus();
    const { text } = useText();
    setRange({
      start: text.value?.length ?? 0,
      end: text.value?.length ?? 0,
    });
  };

  getCursorLineLeftText = () => {
    const { getRange } = this.textArea;
    const { start, end } = getRange();
    const { text } = useText();
    return start === end ? text.value?.slice(0, start).split('\n').pop() ?? null : null;
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
    const { focus } = this.textArea;
    focus();
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
    focus();
    const { handleInput } = useText();
    handleInput('');
  };

  replaceSelectionText = (text: string) => {
    const { insertText } = this.textArea;
    insertText(text);
  };

  getCurrentSelectedStr = () => {
    const { getRange } = this.textArea;
    const { start, end } = getRange();
    const { text } = useText();
    return end > start ? text.value?.slice(start, end) ?? undefined : undefined;
  };

  changeSelectionTo = (insertText: string, selectedText: string | undefined) => {
    const { getRange, setRange } = this.textArea;
    const selectedIndexOfStr = selectedText ? insertText.indexOf(selectedText) : -1;
    const cursorEndIndex = getRange().end;

    if (!selectedText || selectedIndexOfStr === -1) return;

    const { text } = useText();
    const textSliced = text.value?.slice(0, cursorEndIndex) ?? '';
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
