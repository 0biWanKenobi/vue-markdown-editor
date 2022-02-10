import { computed, nextTick, ref, SetupContext } from 'vue';
import EditHistory from '@/types/editHistoryType';
import Hotkeys from '@/utils/hotkeys';
import insertTextAtCursor from 'insert-text-at-cursor';
import { HotKey } from '@/types/hotKeyType';

const timer = ref<NodeJS.Timeout>();
const historyStack = ref<Array<EditHistory>>([]);
const historyIndex = ref(0);

const hotkeysManager = new Hotkeys();
const textareaEl = ref();
const textareaHtml = computed(() => textareaEl.value?.$el);
const ctx = ref<SetupContext>();

const triggerInputBySetHistory = ref(false);

const focus = () => {
  textareaHtml.value?.focus();
};

const insertText = (text: string) => {
  insertTextAtCursor(textareaHtml.value, text);
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
  if (historyIndex.value <= 0) return;

  historyIndex.value--;
  goHistory(historyIndex.value);
};

const redo = () => {
  if (historyIndex.value >= historyStack.value.length - 1) return;

  historyIndex.value++;
  goHistory(historyIndex.value);
};

const registerHotkeys = (config: HotKey) => {
  hotkeysManager.registerHotkeys(config);
};

const heightAtLine = (lineIndex: number) => {
  const el = textareaHtml.value?.querySelector(`section[data-line="${lineIndex}"]`);

  return el ? el.offsetTop + el.offsetHeight : 0;
};

const getRange = () => {
  return {
    start: textareaHtml.value?.selectionStart,
    end: textareaHtml.value?.selectionEnd,
  };
};

const setRange = ({ start, end }: { start: number; end: number }) => {
  textareaHtml.value?.setSelectionRange(start, end);
  updateCurrentHistoryRange();
};

const updateCurrentHistoryRange = () => {
  if (timer.value) return;

  updateHistory(historyIndex.value, {
    range: getRange(),
  });
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
