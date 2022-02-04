<template>
  <div
    class="v-md-editor-preview"
    :style="{
      tabSize,
    }"
    @click="onPreviewClick"
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
  setup(_, { emit }) {
    const { previewEl, handlePreviewClick } = usePreview();

    const onPreviewClick = (e: Event) => {
      const result = handlePreviewClick(e);
      if (result) emit('image-click', result);
    };

    return {
      previewEl,
      onPreviewClick,
    };
  },
});
</script>
