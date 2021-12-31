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
import { defineComponent, reactive, ref, toRefs, watch } from 'vue';
import xss from '@/utils/xss/index';
import { VMdParser } from '@/utils/v-md-parser';
import usePreview from './modules/usePreview';
import { previewProps, previewEmits } from '@/modules/preview';
import useVMdParser from './modules/useVMdParser';

const { previewEl, handlePreviewClick } = usePreview('preview');

const vMdParser = new VMdParser();
vMdParser.lang.config = reactive(vMdParser.lang.config);
//component.vMdParser = new VMdParser();

export default defineComponent({
  name: 'v-md-preview',
  props: {
    ...previewProps,
    text: {
      type: String,
      default: '',
    },
    theme: Object,
    beforeChange: Function,
  },
  emits: [...previewEmits, 'change'],
  setup(props, { emit }) {
    const vMdParser = useVMdParser();
    const { text, beforeChange } = toRefs(props);
    const html = ref<string>();

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
    watch(
      () => text.value,
      () => handleTextChange()
    );

    return {
      html,
      previewEl,
      handleTextChange,
      handlePreviewClick,
    };
  },
  data() {
    return {
      html: '',
    };
  },
  watch: {
    text() {
      this.handleTextChange();
    },
    langConfig() {
      this.handleTextChange();
    },
  },
  computed: {
    vMdParser() {
      return this.$options.vMdParser;
    },
    previewClass() {
      return this.vMdParser.themeConfig.previewClass;
    },
    langConfig() {
      return this.vMdParser.lang.langConfig;
    },
  },
  created() {
    this.handleTextChange();
  },
  methods: {},
});
</script>
