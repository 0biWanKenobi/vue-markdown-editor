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
      <scrollbar @scroll="handleEditorScroll" ref="editorScrollerEl">
        <v-md-textarea-editor
          :model-value="text"
          :min-height="textEditorMinHeight"
          :placeholder="placeholder"
          @update:modelValue="handleInput"
          @click.stop
          @drop="handleDrop"
          @paste="handlePaste"
          @blur="handleBlur"
          ref="editorEngineEl"
        />
      </scrollbar>
    </template>
    <template #preview>
      <scrollbar ref="previewScrollerEl">
        <v-md-preview
          :text="text"
          :tab-size="tabSize"
          :scroll-container="getPreviewScrollContainer"
          :before-change="beforePreviewChange"
          @change="handleChange"
          @image-click="handlePreviewImageClick"
          ref="previewEl"
        />
      </scrollbar>
    </template>
    <v-md-upload-file v-if="hasUploadImage" :upload-config="uploadImgConfig" ref="uploadFile" />
  </v-md-container>
</template>

<script lang="ts">
import TextareaEditor from '@/components/textarea-editor.vue';
import VMdContainer from '@/components/container.vue';
import { editorProps, editorEmits, editorComponents, shouldInheritAttrs } from './modules/common';
import { toolbarProps } from './modules/toolbar';
import { uploadImageProps } from './modules/upload-image';
import { vModelProps, vModelEmits } from './modules/v-model';

import { inBrowser } from '@/utils/util';
import {
  defineComponent,
  nextTick,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  ref,
  watch,
  toRefs,
} from 'vue';
import useToolbarItems from './modules/useToolbarItems';
import useVModel from './modules/useVModel';
import useCommon from './modules/useCommon';
import useSyncScroll from './modules/useSyncScroll';
import useEditor from './modules/useEditor';
import useToc from './modules/useToc';
import useScroll from './modules/useScroll';
import useFullscreen from './modules/useFullscreen';
import useLang from './modules/useLang';
import useUploadImage from './modules/useUploadImage';
import useList from './modules/useList';
import LifecycleStage from './types/lifecycleStage';
import type BaseEditor from './classes/baseEditor';
import '@/assets/css/font';

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
    VMdContainer,
    ...editorComponents(),
  },
  setup(props, ctx) {
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

    const customSlotButtons = Object.keys(props.toolbar).filter((btn) => props.toolbar[btn].slot);
    const { setLeftToolbarItems, setRightToolbarItems, setCustomToolbarItems } = useToolbarItems();
    setLeftToolbarItems(props.leftToolbar);
    setRightToolbarItems(props.rightToolbar);
    setCustomToolbarItems(customSlotButtons);

    const { handleChange, handleBlur, handlePreviewImageClick, mode, currentMode } = useCommon(ctx);
    mode.value = props.mode;

    const { text } = useVModel();
    const {
      editor: {
        getCursorLineLeftText,
        focus,
        clear: clearEditor,
        replaceSelectionText,
        editorEngineEl,
        editorScrollerEl,
        previewEl,
        previewScrollerEl,
      },
      setContext,
      callLifeCycleHooks,
    } = useEditor<BaseEditor>('base');

    setContext(ctx);

    onBeforeMount(() => {
      callLifeCycleHooks(LifecycleStage.beforeMount);
    });

    onMounted(() => {
      callLifeCycleHooks(LifecycleStage.mounted);
    });

    onBeforeUnmount(() => {
      callLifeCycleHooks(LifecycleStage.beforeUnmount);
    });

    onUnmounted(() => {
      callLifeCycleHooks(LifecycleStage.unmounted);
    });

    // Must implement
    const editorFocusEnd = () => {
      focus();

      editorEngineEl.value.setRange({
        start: text.value?.length ?? 0,
        end: text.value?.length ?? 0,
      });
    };
    // Must implement
    const delLineLeft = () => {
      const { start } = editorEngineEl.value.getRange();

      const leftText = getCursorLineLeftText() ?? '';
      editorEngineEl.value.setRange({ start: start - leftText.length - 1, end: start });
      replaceSelectionText('\n');
    };

    const { handleInput } = useVModel();
    // Must implement
    const { emit } = ctx;
    const clear = () => {
      clearEditor();
      emit('update:modelValue', '');
    };

    useList();
    const { handleNavClick, tocVisible, titles } = useToc();
    const { handleEditorScroll } = useSyncScroll();
    const { getPreviewScrollContainer } = useScroll();
    const { fullscreen } = useFullscreen(ctx);
    const { langConfig } = useLang();
    const { uploadImageConfig } = toRefs(props);
    const { handleDrop, handlePaste, hasUploadImage, uploadImgConfig } = useUploadImage(
      ctx,
      uploadImageConfig.value
    );

    return {
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
      previewEl,
      previewScrollerEl,
      editorEngineEl,
      editorScrollerEl,
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
