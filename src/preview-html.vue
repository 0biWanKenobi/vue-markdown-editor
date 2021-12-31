<template>
  <div
    class="v-md-editor-preview"
    :style="{
      tabSize,
    }"
    @click="(e) => handlePreviewClick($emit, e)"
    ref="previewEl"
  >
    <div :class="[previewClass]" v-html="html" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import usePreview from './modules/usePreview';
import { previewProps, previewEmits } from '@/modules/preview';

const { previewEl, handlePreviewClick } = usePreview('htmlPreview');

export default defineComponent({
  name: 'v-md-preview-html',
  props: {
    ...previewProps,
    html: {
      type: String,
      default: '',
    },
    previewClass: String,
  },
  emits: previewEmits,
  setup() {
    return {
      previewEl,
      handlePreviewClick,
    };
  },
});
</script>
