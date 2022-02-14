<template>
  <scrollbar type="editor" @scroll="handleEditorScroll">
    <v-md-textarea-editor
      :model-value="text"
      :min-height="textEditorMinHeight"
      :placeholder="placeholder"
      @update:modelValue="handleInput"
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
import { defineComponent, nextTick, ref, watch } from 'vue';
import useCommon from './modules/useCommon';
import useSyncScroll from './modules/useSyncScroll';
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

    const { setFocusEnd: handleEditorWrapperClick } = useCommon(ctx, props);

    const { handleEditorScroll } = useSyncScroll();
    // const { handleDrop, handlePaste } = useUploadImage();

    return {
      textareaCmp,
      handleEditorScroll,
      handleEditorWrapperClick,
      textEditorMinHeight,
    };
  },
});

// createEditor(component);
</script>
