import { nextTick, ref, SetupContext } from 'vue';
import EditHistory from '@/types/editHistoryType';
import Hotkeys from '@/utils/hotkeys';
import insertTextAtCursor from 'insert-text-at-cursor';

const timer = ref<NodeJS.Timeout>();
const historyStack = ref<Array<EditHistory>>([]);
const historyIndex = ref(0);

const hotkeysManager = new Hotkeys();
const textareaEl = ref();
const ctx = ref<SetupContext>();

const triggerInputBySetHistory = ref(false);

const focus = () => {
  textareaEl.value?.focus();
};

const insertText = (text: string) => {
  insertTextAtCursor(textareaEl.value, text);
};

const goHistory = (index: number) => {
  const { value, range } = historyStack.value[index];

  ctx.value?.emit('update:modelValue', value);
  triggerInputBySetHistory.value = true;

  nextTick(() => {
    triggerInputBySetHistory.value = false;
    setRange(range);
  });
};

const undo = () => {
  if (historyIndex.value > 0) {
    historyIndex.value--;
    goHistory(historyIndex.value);
  }
};

const redo = () => {
  if (historyIndex.value < historyStack.value.length - 1) {
    historyIndex.value++;
    goHistory(historyIndex.value);
  }
};

const registerHotkeys = (config: any) => {
  hotkeysManager.registerHotkeys(config);
};

const heightAtLine = (lineIndex: number) => {
  const el = textareaEl.value?.querySelector(`section[data-line="${lineIndex}"]`);

  return el ? el.offsetTop + el.offsetHeight : 0;
};

const getRange = () => {
  return {
    start: textareaEl.value?.selectionStart,
    end: textareaEl.value?.selectionEnd,
  };
};

const setRange = ({ start, end }: { start: number; end: number }) => {
  textareaEl.value?.setSelectionRange(start, end);
  updateCurrentHistoryRange();
};

const updateCurrentHistoryRange = () => {
  if (!timer.value) {
    updateHistory(historyIndex.value, {
      range: getRange(),
    });
  }
};

const updateHistory = (index: number, data: Partial<EditHistory>) => {
  const history = historyStack.value[index];

  if ('value' in data) history.value = data.value;
  Object.assign(history.range, data.range);
};

export default (_ctx?: SetupContext<any>) => {
  if (_ctx) ctx.value = _ctx;
  return {
    triggerInputBySetHistory,
    historyStack,
    historyIndex,
    hotkeysManager,
    textareaEl,
    registerHotkeys,
    heightAtLine,
    insertText,
    focus,
    getRange,
    setRange,
    updateCurrentHistoryRange,
    undo,
    redo,
  };
};
