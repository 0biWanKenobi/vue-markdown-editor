import { nextTick, ref } from 'vue';
import insertTextAtCursor from 'insert-text-at-cursor';
import type EditHistory from '@/types/editHistoryType';

class TextArea {
  private timer = ref<NodeJS.Timeout>();
  private historyStack = ref<Array<EditHistory>>([]);
  private historyIndex = ref(0);
  textareaEl = ref();
  textareaCmp = ref();
  triggerInputBySetHistory = ref(false);

  focus = () => {
    this.textareaEl.value?.focus();
  };

  insertText = (text: string) => {
    insertTextAtCursor(this.textareaEl.value, text);
  };

  saveHistory = (v: string | undefined, historyMax: number) => {
    if (this.triggerInputBySetHistory.value) {
      this.triggerInputBySetHistory.value = false;
      return;
    }

    const range = this.getRange();
    const history = {
      value: v,
      range,
    };

    this.historyStack.value = this.historyStack.value.slice(0, this.historyIndex.value + 1);
    this.historyStack.value.push(history);
    if (this.historyStack.value.length > historyMax) this.historyStack.value.shift();
    this.historyIndex.value = this.historyStack.value.length - 1;
  };

  private goHistory = (index: number) => {
    const { value, range } = this.historyStack.value[index];
    this.triggerInputBySetHistory.value = true;

    nextTick(() => {
      this.setRange(range);
    });

    return value ?? '';
  };

  undo = () => {
    if (this.historyIndex.value <= 0) return false;

    this.historyIndex.value--;
    return this.goHistory(this.historyIndex.value);
  };

  redo = () => {
    if (this.historyIndex.value >= this.historyStack.value.length - 1) return false;
    this.historyIndex.value++;
    return this.goHistory(this.historyIndex.value);
  };

  heightAtLine = (lineIndex: number) => {
    const el = this.textareaEl.value?.querySelector(`section[data-line="${lineIndex}"]`);

    return el ? el.offsetTop + el.offsetHeight : 0;
  };

  getRange = () => {
    return {
      start: this.textareaEl.value?.selectionStart,
      end: this.textareaEl.value?.selectionEnd,
    };
  };

  setRange = ({ start, end }: { start: number; end: number }) => {
    this.textareaEl.value?.setSelectionRange(start, end);
    this.updateCurrentHistoryRange();
  };

  updateCurrentHistoryRange = () => {
    if (this.timer.value) return;

    this._updateHistory(this.historyIndex.value, {
      range: this.getRange(),
    });
  };

  private _updateHistory = (index: number, data: Partial<EditHistory>) => {
    const history = this.historyStack.value[index];

    if ('value' in data) history.value = data.value;
    Object.assign(history.range, data.range);
  };
}

export default TextArea;
