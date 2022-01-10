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
import { defineComponent, onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
import VueTypes from 'vue-types';
import useTextarea from '@/modules/useTextarea';

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
  setup(props, ctx) {
    const { emit } = ctx;
    const { triggerInputBySetHistory, hotkeysManager, textareaEl } = useTextarea(ctx);

    onMounted(() => {
      saveHistory();

      textareaEl.value?.addEventListener('keydown', handleKeydown, false);
    });

    onBeforeUnmount(() => {
      textareaEl.value?.removeEventListener('keydown', handleKeydown, false);
    });

    const handleKeydown = (e: KeyboardEvent) => {
      hotkeysManager.dispatch(e);
    };

    const isComposing = ref(false);

    const { modelValue } = toRefs(props);
    const timer = ref<NodeJS.Timeout>();

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

    const clearTheTimeout = () => {
      if (timer.value) clearTimeout(timer.value);
      timer.value = undefined;
    };

    const handleInput = (e: Event) => {
      if (isComposing.value) return;

      emit('update:modelValue', (<HTMLInputElement>e.target)?.value);
    };

    const { historyMax } = toRefs(props);

    const { getRange, historyIndex, historyStack } = useTextarea();

    const saveHistory = () => {
      const range = getRange();
      const history = {
        value: modelValue.value,
        range,
      };

      historyStack.value = historyStack.value.slice(0, historyIndex.value + 1);
      historyStack.value.push(history);
      if (historyStack.value.length > historyMax.value) historyStack.value.shift();
      historyIndex.value = historyStack.value.length - 1;
    };

    const insertText = (text: string) => {
      insertTextAtCursor(textareaEl.value, text);
    };

    const { updateCurrentHistoryRange, undo, redo } = useTextarea();

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
