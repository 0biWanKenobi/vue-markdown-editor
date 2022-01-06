<template>
  <div class="v-md-textarea-editor">
    <pre :style="{ minHeight }"><section
  v-for="(row, idx) in modelValue?.split('\n')"
  :data-line="idx + 1"
>{{ row || ' ' }}<br></section></pre>
    <textarea
      ref="textareaEl"
      :value="modelValue"
      :placeholder="placeholder"
      spellcheck="false"
      @compositionstart="handleCompositionStart"
      @compositionupdate="handleCompositionUpdate"
      @compositionend="handleCompositionEnd"
      @input="handleInput"
      @click="updateCurrentHistoryRange"
      @paste="handlePaste"
      @blur="handleBlur"
      @keydown.tab.prevent
      @keydown.ctrl.z.prevent.exact="undo"
      @keydown.meta.z.prevent.exact="undo"
      @keydown.ctrl.y.prevent.exact="redo"
      @keydown.meta.y.prevent.exact="redo"
      @keyup.shift.up.exact="updateCurrentHistoryRange"
      @keyup.shift.down.exact="updateCurrentHistoryRange"
      @keyup.shift.left.exact="updateCurrentHistoryRange"
      @keyup.shift.right.exact="updateCurrentHistoryRange"
    />
  </div>
</template>

<script lang="ts">
import insertTextAtCursor from 'insert-text-at-cursor';
import { isKorean } from '@/utils/util';
import { defineComponent, nextTick, onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
import VueTypes from 'vue-types';
import Hotkeys from '@/utils/hotkeys';

export default defineComponent({
  name: 'v-md-textarea-editor',
  props: {
    modelValue: String,
    minHeight: String,
    placeholder: String,
    historyDebounce: VueTypes.number.def(400),
    historyMax: VueTypes.number.def(30),
  },
  emits: ['blur', 'paste', 'update:modelValue'],
  setup(props, { emit }) {
    onMounted(() => {
      saveHistory();

      textareaEl.value?.$el.addEventListener('keydown', handleKeydown, false);
    });

    onBeforeUnmount(() => {
      textareaEl.value?.$el.removeEventListener('keydown', handleKeydown, false);
    });

    const handleKeydown = (e: KeyboardEvent) => {
      hotkeysManager.dispatch(e);
    };

    const isComposing = ref(false);
    const textareaEl = ref();

    const { modelValue } = toRefs(props);
    const timer = ref<NodeJS.Timeout>();

    let triggerInputBySetHistory = false;
    watch(
      () => modelValue.value,
      () => {
        clearTheTimeout();
        if (!triggerInputBySetHistory) {
          timer.value = setTimeout(() => {
            saveHistory();

            clearTheTimeout();
          }, props.historyDebounce);
        }
      }
    );

    const handleCompositionStart = () => {
      isComposing.value = true;
    };
    const handleCompositionUpdate = (event: CompositionEvent) => {
      const text = (<HTMLInputElement>event.target)?.value;
      const lastCharacter = text[text.length - 1] || '';
      isComposing.value = !isKorean(lastCharacter);
    };

    const handleCompositionEnd = (event: CompositionEvent) => {
      if (isComposing.value) {
        isComposing.value = false;
        handleInput(event);
      }
    };

    const handlePaste = (e: Event) => {
      emit('paste', e);
    };

    const handleBlur = (e: Event) => {
      emit('blur', e);
    };

    const hotkeysManager = new Hotkeys();

    const registerHotkeys = (config: any) => {
      hotkeysManager.registerHotkeys(config);
    };

    const heightAtLine = (lineIndex: number) => {
      const el = textareaEl.value?.$el.querySelector(`section[data-line="${lineIndex}"]`);

      return el ? el.offsetTop + el.offsetHeight : 0;
    };

    const clearTheTimeout = () => {
      if (timer.value) clearTimeout(timer.value);
      timer.value = undefined;
    };

    const updateCurrentHistoryRange = () => {
      if (!timer.value) {
        updateHistory(historyIndex, {
          range: getRange(),
        });
      }
    };

    const handleInput = (e: Event) => {
      if (isComposing.value) return;

      emit('update:modelValue', (<HTMLInputElement>e.target)?.value);
    };

    type History = {
      value: string | undefined;
      range: {
        start: any;
        end: any;
      };
    };
    let historyStack: Array<History> = [];
    let historyIndex = 0;
    const { historyMax } = toRefs(props);

    const saveHistory = () => {
      const range = getRange();
      const history = {
        value: modelValue.value,
        range,
      };

      historyStack = historyStack.slice(0, historyIndex + 1);
      historyStack.push(history);
      if (historyStack.length > historyMax.value) historyStack.shift();
      historyIndex = historyStack.length - 1;
    };

    const updateHistory = (index: number, data: any) => {
      const history = historyStack[index];

      if ('value' in data) history.value = data.value;
      Object.assign(history.range, data.range);
    };

    const goHistory = (index: number) => {
      const { value, range } = historyStack[index];

      emit('update:modelValue', value);
      triggerInputBySetHistory = true;

      nextTick(() => {
        triggerInputBySetHistory = false;
        setRange(range);
      });
    };

    const getRange = () => {
      return {
        start: textareaEl.value?.$el.selectionStart,
        end: textareaEl.value?.$el.selectionEnd,
      };
    };

    const setRange = ({ start, end }: { start: number; end: number }) => {
      textareaEl.value?.$el.setSelectionRange(start, end);
      updateCurrentHistoryRange();
    };

    const focus = () => {
      textareaEl.value?.$el.focus();
    };

    const insertText = (text: string) => {
      insertTextAtCursor(textareaEl.value?.$el, text);
    };

    const undo = () => {
      if (historyIndex > 0) {
        historyIndex--;
        goHistory(historyIndex);
      }
    };

    const redo = () => {
      if (historyIndex < historyStack.length - 1) {
        historyIndex++;
        goHistory(historyIndex);
      }
    };

    return {
      isComposing,
      textareaEl,
      handleCompositionStart,
      handleCompositionUpdate,
      handleCompositionEnd,
      handleInput,
      updateCurrentHistoryRange,
      handlePaste,
      handleBlur,
      undo,
      redo,
    };
  },
});
</script>

<style lang="scss">
@import '@/styles/var';

@mixin common {
  box-sizing: border-box;
  padding: 20px 20px 30px;
  overflow: hidden;
  color: $text-color;
  font-size: $editor-font-size;
  font-family: $editor-font-family;
  line-height: $editor-line-height;
  word-break: break-all;
}

.v-md-textarea-editor {
  position: relative;

  pre {
    margin: 0;
    white-space: pre-wrap;
    visibility: hidden;
    @include common;
  }

  textarea {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    resize: none;
    @include common;

    &::placeholder {
      color: $text-color-placeholder;
    }
  }
}
</style>
