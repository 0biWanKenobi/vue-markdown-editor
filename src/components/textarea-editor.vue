<template>
  <div class="v-md-textarea-editor">
    <pre :style="{ minHeight }"><section
  v-for="(row, idx) in modelValue?.split('\n')"
  :data-line="idx + 1"
>{{ row || ' ' }}<br></section></pre>
    <textarea
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
      @keydown="handleKeydown"
      @keydown.tab.prevent
      @keydown.ctrl.z.prevent.exact="undo"
      @keydown.meta.z.prevent.exact="undo"
      @keydown.ctrl.y.prevent.exact="redo"
      @keydown.meta.y.prevent.exact="redo"
      @keyup.shift.up.exact="updateCurrentHistoryRange"
      @keyup.shift.down.exact="updateCurrentHistoryRange"
      @keyup.shift.left.exact="updateCurrentHistoryRange"
      @keyup.shift.right.exact="updateCurrentHistoryRange"
      ref="textareaEl"
    />
  </div>
</template>

<script lang="ts">
import { isKorean } from '@/utils/util';
import { defineComponent, inject, onMounted, ref, toRefs, watch } from 'vue';
import VueTypes from 'vue-types';
import { StateSymbol } from '@/classes/state';

const ol = /^\s*([\d]+\.)( \[[ xX]])? /;
const ul = /^\s*([-*])( \[[ xX]])? /;

const ulSyntax = /([*-] |[\d]+\. )/;
const olSyntax = /([\d])+\.( \[[ xX]])? /;

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
    const { modelValue, historyMax } = toRefs(props);

    const state = inject(StateSymbol)!;
    const { saveHistory, textareaEl, updateCurrentHistoryRange } = state.value.textArea!;

    onMounted(() => {
      saveHistory(modelValue.value, historyMax.value);
    });

    const handleKeydown = (e: KeyboardEvent) => {
      const { hotkeysManager } = state.value;
      hotkeysManager.dispatch(e, state.value);
    };

    const isComposing = ref(false);

    const timer = ref<NodeJS.Timeout>();

    watch(
      () => modelValue.value,
      () => {
        clearTheTimeout();
        const { triggerInputBySetHistory } = state.value.textArea!;
        if (!triggerInputBySetHistory.value) {
          timer.value = setTimeout(() => {
            const { saveHistory } = state.value.textArea!;
            saveHistory(modelValue.value, historyMax.value);

            clearTheTimeout();
          }, props.historyDebounce);
        }
      }
    );

    const handleCompositionStart = () => {
      isComposing.value = true;
    };
    const handleCompositionUpdate = (event: CompositionEvent) => {
      const text = (<HTMLInputElement | undefined>event.target)?.value;
      const lastCharacter = text ? text[text.length - 1] : '';
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

    const areaUndo = () => {
      const { undo } = state.value.textArea!;
      const maybeOldVal = undo();
      maybeOldVal && emit('update:modelValue', maybeOldVal);
    };

    const areaRedo = () => {
      const { redo } = state.value.textArea!;
      const maybeOldVal = redo();
      maybeOldVal && emit('update:modelValue', maybeOldVal);
    };

    state.value.hotkeysManager.registerHotkeys({
      key: 'enter',
      preventDefault: false,
      action: (e: any) => {
        if (isComposing.value) return;

        const {
          editor: { getCursorLineLeftText, replaceSelectionText },
        } = state.value;

        const cursorLineLeftText = getCursorLineLeftText();
        let suffix;
        let syntax;

        if (cursorLineLeftText && ol.test(cursorLineLeftText)) {
          suffix = 'x. ';
          syntax = olSyntax;

          e.preventDefault();
        } else if (cursorLineLeftText && ul.test(cursorLineLeftText)) {
          suffix = '- ';
          syntax = ulSyntax;

          e.preventDefault();
        } else {
          return;
        }

        const indent = cursorLineLeftText.search(syntax);
        const suffixIndex = indent + suffix.length;
        let beforeText = cursorLineLeftText.slice(0, suffixIndex);
        const content = cursorLineLeftText.slice(suffixIndex, cursorLineLeftText.length);

        if (content) {
          if (suffix === 'x. ') {
            beforeText = beforeText.replace(/(\d+)/, (parseInt(beforeText) + 1).toString());
          }

          replaceSelectionText(`\n${beforeText}`, 'end');
        }
      },
    });

    return {
      textareaEl,
      isComposing,
      handleKeydown,
      handleCompositionStart,
      handleCompositionUpdate,
      handleCompositionEnd,
      handleInput,
      updateCurrentHistoryRange,
      handlePaste,
      handleBlur,
      undo: areaUndo,
      redo: areaRedo,
    };
  },
});
</script>

<style lang="scss">
@import '../styles/var';

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
