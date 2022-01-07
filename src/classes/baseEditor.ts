import { ref, Ref } from 'vue';
import IEditor from '@/interfaces/IEditor';
import useVModel from '@/modules/useVModel';

class BaseEditor implements IEditor {
  editorEngineEl: Ref<any>;
  previewScrollerEl: Ref<any>;
  previewEl: Ref<any>;
  editorScrollerEl: Ref<any>;
  editorFocusEnd = () => {
    focus();
    const { text } = useVModel();
    this.editorEngineEl.value.setRange({
      start: text.value?.length ?? 0,
      end: text.value?.length ?? 0,
    });
  };
  getCursorLineLeftText = () => {
    const { start, end } = this.editorEngineEl.value.getRange();
    const { text } = useVModel();
    return start === end ? text.value?.slice(0, start).split('\n').pop() ?? null : null;
  };
  editorRegisterHotkeys = (...arg: any[]) => {
    this.editorEngineEl.value.registerHotkeys(...arg);
  };
  editorScrollToTop = (scrollTop: number) => {
    this.editorScrollerEl.value.scrollTo(scrollTop);
  };
  getScrollInfo = () => {
    return this.editorScrollerEl.value.getScrollInfo();
  };
  heightAtLine: (...arg: any[]) => number = (...arg) => {
    return this.editorEngineEl.value.heightAtLine(...arg);
  };
  focus = () => {
    this.editorEngineEl.value.focus();
  };
  undo = () => {
    this.editorEngineEl.value.undo();
  };
  redo = () => {
    this.editorEngineEl.value.redo();
  };
  clear = () => {
    focus();
    const { handleInput } = useVModel();
    handleInput('');
  };
  replaceSelectionText = (text: string) => {
    this.editorEngineEl.value.insertText(text);
  };
  getCurrentSelectedStr = () => {
    const { start, end } = this.editorEngineEl.value.getRange();
    const { text } = useVModel();
    return end > start ? text.value?.slice(start, end) ?? undefined : undefined;
  };
  changeSelectionTo = (insertText: string, selectedText: string | undefined) => {
    const selectedIndexOfStr = selectedText ? insertText.indexOf(selectedText) : -1;
    const cursorEndIndex = this.editorEngineEl.value.getRange().end;

    if (!selectedText || selectedIndexOfStr === -1) return;

    const { text } = useVModel();
    const textSliced = text.value?.slice(0, cursorEndIndex) ?? '';
    const insertTextIndex = textSliced.length - insertText.length;
    const rangeStartIndex = insertTextIndex + selectedIndexOfStr;
    const rangeEndIndex = rangeStartIndex + selectedText.length;

    this.editorEngineEl.value.setRange({
      start: rangeStartIndex,
      end: rangeEndIndex,
    });
  };

  constructor() {
    this.editorEngineEl = ref();
    this.editorScrollerEl = ref();
    this.previewScrollerEl = ref();
    this.previewEl = ref();
  }
}

export default BaseEditor;
