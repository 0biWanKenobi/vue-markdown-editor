<template>
  <scrollbar type="editor" @scroll="handleEditorScroll">
    <v-md-textarea-editor
      :model-value="text"
      :min-height="textEditorMinHeight"
      :placeholder="placeholder"
      @update:modelValue="handleInput"
      @click.stop
      @drop="handleDrop"
      @paste="handlePaste"
      @blur="handleBlur"
      ref="textareaEl"
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
import { defineComponent, nextTick, ref, watch } from 'vue';
import useVModel from './modules/useText';
import useCommon from './modules/useCommon';
import useSyncScroll from './modules/useSyncScroll';
import useUploadImage from './modules/useUploadImage';
import useTextarea from './modules/useTextarea';

export default defineComponent({
  name: 'v-md-editor',
  inheritAttrs: shouldInheritAttrs,
  props: {
    ...baseEditorProps,
    ...sharedEditorProps,
    text: String,
  },
  emits: [...editorEmits, ...vModelEmits],
  components: {
    [TextareaEditor.name]: TextareaEditor,
    Scrollbar,
  },
  setup(props, ctx) {
    const textEditorMinHeight = ref<string>();
    const containerEl = ref();
    const { textareaEl } = useTextarea();

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

    const { emit } = ctx;

    const handleBlur = (e: Event) => {
      emit('blur', e);
    };

    const { setFocusEnd: handleEditorWrapperClick } = useCommon(ctx, props);

    const { handleInput } = useVModel();

    const { handleEditorScroll } = useSyncScroll();
    const { handleDrop, handlePaste } = useUploadImage();

    return {
      textareaEl,
      handleEditorScroll,
      handleInput,
      handleDrop,
      handlePaste,
      handleBlur,
      handleEditorWrapperClick,
      textEditorMinHeight,
    };
  },
});

// createEditor(component);
</script>
