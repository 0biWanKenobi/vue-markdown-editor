<template>
  <scrollbar type="editor" @scroll="handleEditorScroll">
    <v-md-textarea-editor
      :model-value="modelValue"
      :min-height="textEditorMinHeight"
      :placeholder="placeholder"
      @update:modelValue="$emit('update:modelValue', $event)"
      @click.stop
      @drop="$emit('drop', $event)"
      @paste="$emit('paste', $event)"
      @blur="$emit('blur', $event)"
      ref="textareaCmp"
    />
  </scrollbar>
</template>

<script lang="ts">
import TextareaEditor from '@/components/textarea-editor.vue';
import Scrollbar from '@/components/scrollbar/index.vue';
import {
  baseEditorProps,
  sharedEditorProps,
  shouldInheritAttrs,
  editorEmits,
} from './modules/common';
import { vModelEmits } from './modules/v-model';

import { inBrowser } from '@/utils/util';
import { defineComponent, inject, nextTick, ref, shallowRef, watch } from 'vue';
import useSyncScroll from './modules/useSyncScroll';
import useTextarea from './modules/useTextarea';
import BaseEditor from './classes/baseEditor';
import IEditor from './interfaces/IEditor';
import { StateSymbol } from './classes/state';

export default defineComponent({
  name: 'v-md-editor',
  inheritAttrs: shouldInheritAttrs,
  props: {
    ...baseEditorProps,
    ...sharedEditorProps,
    modelValue: String,
  },
  emits: [...editorEmits, ...vModelEmits],
  components: {
    [TextareaEditor.name]: TextareaEditor,
    Scrollbar,
  },
  setup(props, ctx) {
    const editor = shallowRef<IEditor>(new BaseEditor(ctx));
    const state = inject(StateSymbol)!;
    state.value.editor = editor.value;

    const textEditorMinHeight = ref<string>();
    const containerEl = ref();
    const { textareaCmp } = useTextarea();

    watch(
      () => props.height,
      async (h) => {
        if (!inBrowser) return;

        await nextTick();

        if (h) {
          const editorWrapper = containerEl.value?.querySelector('.v-md-editor__editor-wrapper');
          editorWrapper &&
            (textEditorMinHeight.value = window.getComputedStyle(editorWrapper).height);
        } else {
          textEditorMinHeight.value = '';
        }
      },
      {
        immediate: true,
      }
    );

    const { handleEditorScroll } = useSyncScroll();

    return {
      editor,
      textareaCmp,
      handleEditorScroll,
      textEditorMinHeight,
    };
  },
});

// createEditor(component);
</script>
