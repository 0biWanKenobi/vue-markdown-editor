import { nextTick, ref, SetupContext } from 'vue';
import insertTextAtCursor from 'insert-text-at-cursor';
import type EditHistory from '@/types/editHistoryType';
import Hotkeys from '@/utils/hotkeys';
import { HotKey } from '@/types/hotKeyType';

class TextArea {
  private timer = ref<NodeJS.Timeout>();
  private historyStack = ref<Array<EditHistory>>([]);
  private historyIndex = ref(0);

  private hotkeysManager = new Hotkeys();
  private textareaEl = ref();
  private triggerInputBySetHistory = ref(false);

  focus = () => {
    this.textareaEl.value?.focus();
  };

  insertText = (text: string) => {
    insertTextAtCursor(this.textareaEl.value, text);
  };

  private goHistory = (index: number, ctx: SetupContext) => {
    const { value, range } = this.historyStack.value[index];

    ctx.emit('update:modelValue', value);
    this.triggerInputBySetHistory.value = true;

    nextTick(() => {
      this.triggerInputBySetHistory.value = false;
      this.setRange(range);
    });
  };

  undo = (ctx: SetupContext) => {
    if (this.historyIndex.value <= 0) return;

    this.historyIndex.value--;
    this.goHistory(this.historyIndex.value, ctx);
  };

  redo = (ctx: SetupContext) => {
    if (this.historyIndex.value >= this.historyStack.value.length - 1) return;

    this.historyIndex.value++;
    this.goHistory(this.historyIndex.value, ctx);
  };

  registerHotkeys = (config: HotKey) => {
    this.hotkeysManager.registerHotkeys(config);
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

    this.updateHistory(this.historyIndex.value, {
      range: this.getRange(),
    });
  };

  updateHistory = (index: number, data: Partial<EditHistory>) => {
    const history = this.historyStack.value[index];

    if ('value' in data) history.value = data.value;
    Object.assign(history.range, data.range);
  };
}

export default TextArea;
