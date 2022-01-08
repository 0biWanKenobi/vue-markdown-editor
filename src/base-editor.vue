<template>
  <v-md-container
    :disabled-menus="disabledMenus"
    :height="height"
    :fullscreen="fullscreen"
    :left-area-visible="tocVisible"
    :left-area-title="langConfig.toc.title"
    :left-area-reverse="tocNavPositionRight"
    :mode="currentMode"
    ref="container"
  >
    <template v-for="button of customSlotButtons" #[button]="slotData">
      <slot :name="button" v-bind="slotData" />
    </template>
    <template #left-area>
      <scrollbar>
        <toc-nav :titles="titles" @nav-click="handleNavClick" />
      </scrollbar>
    </template>
    <template #editor>
      <scrollbar @scroll="handleEditorScroll" ref="editorScroller">
        <v-md-textarea-editor
          :model-value="text"
          :min-height="textEditorMinHeight"
          :placeholder="placeholder"
          @update:modelValue="handleInput"
          @click.stop
          @drop="(e) => handleDrop($emit, e)"
          @paste="(e) => handlePaste($emit, e)"
          @blur="(e) => handleBlur($emit, e)"
          ref="editorEngine"
        />
      </scrollbar>
    </template>
    <template #preview>
      <scrollbar ref="previewScroller">
        <v-md-preview
          :text="text"
          :tab-size="tabSize"
          :scroll-container="getPreviewScrollContainer"
          :before-change="beforePreviewChange"
          @change="handleChange"
          @image-click="handlePreviewImageClick"
          ref="preview"
        />
      </scrollbar>
    </template>
    <v-md-upload-file v-if="hasUploadImage" :upload-config="uploadImgConfig" ref="uploadFile" />
  </v-md-container>
</template>

<script lang="ts">
import TextareaEditor from '@/components/textarea-editor.vue';
import { editorProps, editorEmits, editorComponents, shouldInheritAttrs } from './modules/common';
import { toolbarProps } from './modules/toolbar';
import { uploadImageProps } from './modules/upload-image';
import { vModelProps, vModelEmits } from './modules/v-model';

import { inBrowser } from '@/utils/util';
import { computed, defineComponent, nextTick, ref, watch } from 'vue';
import useToolbarItems from './modules/useToolbarItems';
import useToolbar from './modules/useToolbar';
import useVModel from './modules/useVModel';
import useCommon from './modules/useCommon';
import useSyncScroll from './modules/useSyncScroll';
import useEditor from './modules/useEditor';
import useToc from './modules/useToc';
import useScroll from './modules/useScroll';
import useFullscreen from './modules/useFullscreen';
import useLang from './modules/useLang';
import useUploadImage from './modules/useUploadImage';

export default defineComponent({
  name: 'v-md-editor',
  inheritAttrs: shouldInheritAttrs,
  props: {
    ...editorProps,
    ...toolbarProps,
    ...vModelProps,
    ...uploadImageProps,
    modelValue: String,
  },
  emits: [...editorEmits, ...vModelEmits],
  components: {
    [TextareaEditor.name]: TextareaEditor,
    ...editorComponents,
  },
  setup(props, { emit }) {
    const textEditorMinHeight = ref<string>();

    const containerEl = ref();

    watch(
      () => props.modelValue,
      (v) => (text.value = v)
    );

    watch(
      () => props.height,
      async (h) => {
        if (!inBrowser) return;

        await nextTick();

        if (h) {
          const editorWrapper = containerEl.value.querySelector('.v-md-editor__editor-wrapper');
          textEditorMinHeight.value = window.getComputedStyle(editorWrapper).height;
        } else {
          textEditorMinHeight.value = '';
        }
      },
      {
        immediate: true,
      }
    );

    const { setLeftToolbarItems, setRightToolbarItems } = useToolbarItems();
    setLeftToolbarItems(props.leftToolbar);
    setRightToolbarItems(props.rightToolbar);

    const {
      addDefaultToolbars,
      handleToolbarItemClick,
      handleToolbarMenuClick,
      toolbars,
    } = useToolbar();
    addDefaultToolbars();

    const customSlotButtons = computed(() =>
      Object.keys(props.toolbar).filter((btn) => toolbar[btn].slot)
    );

    const {
      setFocusEnd,
      handleChange,
      handleBlur,
      handlePreviewImageClick,
      mode,
      currentMode,
    } = useCommon();
    mode.value = props.mode;

    const handleEditorWrapperClick = () => {
      setFocusEnd();
    };

    const { text } = useVModel();
    const {
      editor: {
        getCursorLineLeftText,
        focus,
        clear: clearEditor,
        replaceSelectionText,
        editorEngineEl,
      },
    } = useEditor('base');

    // Must implement
    const editorFocusEnd = () => {
      focus();

      editorEngineEl.value.setRange({
        start: text.value.length,
        end: text.value.length,
      });
    };
    // Must implement
    const delLineLeft = () => {
      const { start } = editorEngineEl.value.getRange();

      const leftText = getCursorLineLeftText();
      editorEngineEl.value.setRange({ start: start - leftText.length - 1, end: start });
      replaceSelectionText('\n');
    };

    const { handleInput } = useVModel();
    // Must implement
    const clear = () => {
      clearEditor();
      emit('update:modelValue', '');
    };

    const { handleNavClick, tocVisible, titles } = useToc();
    const { handleEditorScroll } = useSyncScroll();
    const { getPreviewScrollContainer } = useScroll();
    const { fullscreen } = useFullscreen();
    const { langConfig } = useLang();
    const { handleDrop, handlePaste, hasUploadImage, uploadImgConfig } = useUploadImage();

    return {
      handleEditorWrapperClick,
      handleToolbarItemClick,
      handleToolbarMenuClick,
      toolbars,
      handleNavClick,
      handleEditorScroll,
      handleInput,
      handleDrop,
      handlePaste,
      hasUploadImage,
      uploadImgConfig,
      handleBlur,
      handleChange,
      getPreviewScrollContainer,
      handlePreviewImageClick,
      delLineLeft,
      editorFocusEnd,
      clear,
      customSlotButtons,
      currentMode,
      fullscreen,
      tocVisible,
      titles,
      langConfig,
      text,
    };
  },
  data() {
    return {
      textEditorMinHeight: '',
    };
  },
  methods: {},
});

// createEditor(component);
</script>
