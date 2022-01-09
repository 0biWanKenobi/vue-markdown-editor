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
import { computed, defineComponent, toRefs, watch } from 'vue';
import xss from '@/utils/xss/index';
import usePreview from './modules/usePreview';
import { previewProps, previewEmits } from '@/modules/preview';
import useVMdParser from './modules/useVMdParser';
import VueTypes from 'vue-types';
import useLang from '@/modules/useLang';

export default defineComponent({
  name: 'v-md-preview',
  props: {
    ...previewProps,
    text: VueTypes.string.def(''),
    theme: Object,
    beforeChange: Function,
  },
  emits: [...previewEmits, 'change'],
  setup(props, ctx) {
    const { emit } = ctx;
    const { html, previewEl, handlePreviewClick } = usePreview(ctx);

    const vMdParser = useVMdParser();

    const previewClass = computed(() => vMdParser.themeConfig?.previewClass);

    const { text, beforeChange } = toRefs(props);

    watch(
      () => text.value,
      () => handleTextChange()
    );

    const { langConfig } = useLang();

    watch(
      () => langConfig.value,
      () => handleTextChange()
    );

    const handleTextChange = () => {
      const next = (text: string) => {
        html.value = xss.process(vMdParser.parse(text));

        emit('change', text, html.value);
      };

      if (beforeChange.value) {
        beforeChange.value(text.value, next);
      } else {
        next(text.value);
      }
    };

    handleTextChange();

    return {
      html,
      previewEl,
      previewClass,
      handleTextChange,
      handlePreviewClick,
    };
  },
});
</script>
