<template>
  <div
    class="v-md-editor-preview"
    :style="{
      tabSize,
    }"
    @click="handlePreviewClick"
    ref="previewEl"
  >
    <div :class="[previewClass]" v-html="html" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import usePreview from './modules/usePreview';
import { previewProps, previewEmits } from '@/modules/preview';
import VueTypes from 'vue-types';

export default defineComponent({
  name: 'v-md-preview-html',
  props: {
    ...previewProps,
    html: VueTypes.string.def(''),
    previewClass: String,
  },
  emits: previewEmits,
  setup(_, ctx) {
    const { previewEl, handlePreviewClick } = usePreview(ctx);
    return {
      previewEl,
      handlePreviewClick,
    };
  },
});
</script>
