import IEditor, { Install, Option } from '@/interfaces/IEditor';
import useVModel from '@/modules/useVModel';
import useScrollbar from '@/modules/useScrollbar';
import useTextarea from '@/modules/useTextarea';

class BaseEditor implements IEditor {
  editorFocusEnd = () => {
    focus();
    const { text } = useVModel();
    const { setRange } = useTextarea();
    setRange({
      start: text.value?.length ?? 0,
      end: text.value?.length ?? 0,
    });
  };

  getCursorLineLeftText = () => {
    const { getRange } = useTextarea();
    const { start, end } = getRange();
    const { text } = useVModel();
    return start === end ? text.value?.slice(0, start).split('\n').pop() ?? null : null;
  };

  editorRegisterHotkeys = (...arg: any[]) => {
    const { registerHotkeys } = useTextarea();
    registerHotkeys(arg);
  };

  editorScrollToTop = (scrollTop: number) => {
    const { scrollTo } = useScrollbar('editor');
    scrollTo(scrollTop);
  };

  getScrollInfo = () => {
    const { getScrollInfo } = useScrollbar('editor');
    return getScrollInfo();
  };

  heightAtLine: (...arg: any[]) => number = (...arg) => {
    const { heightAtLine } = useTextarea();
    return heightAtLine(arg[0]);
  };

  focus = () => {
    const { focus } = useTextarea();
    focus();
  };

  undo = () => {
    const { undo } = useTextarea();
    undo();
  };

  redo = () => {
    const { redo } = useTextarea();
    redo();
  };

  clear = () => {
    focus();
    const { handleInput } = useVModel();
    handleInput('');
  };

  replaceSelectionText = (text: string) => {
    const { insertText } = useTextarea();
    insertText(text);
  };

  getCurrentSelectedStr = () => {
    const { getRange } = useTextarea();
    const { start, end } = getRange();
    const { text } = useVModel();
    return end > start ? text.value?.slice(start, end) ?? undefined : undefined;
  };

  changeSelectionTo = (insertText: string, selectedText: string | undefined) => {
    const { getRange, setRange } = useTextarea();
    const selectedIndexOfStr = selectedText ? insertText.indexOf(selectedText) : -1;
    const cursorEndIndex = getRange().end;

    if (!selectedText || selectedIndexOfStr === -1) return;

    const { text } = useVModel();
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
