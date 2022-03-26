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
import { defineComponent, inject } from 'vue';
import { previewProps, previewEmits } from '@/modules/preview';
import VueTypes from 'vue-types';
import { StateSymbol } from './classes/state';

export default defineComponent({
  name: 'v-md-preview-html',
  props: {
    ...previewProps,
    html: VueTypes.string.def(''),
    previewClass: String,
  },
  emits: previewEmits,
  setup(_, { emit }) {
    const state = inject(StateSymbol)!;
    const { previewEl, handlePreviewClick } = state.value.preview;

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
