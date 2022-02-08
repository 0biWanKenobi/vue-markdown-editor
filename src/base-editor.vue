<template>
  <v-md-container
    :height="height"
    :fullscreen="fullscreen"
    :left-area-visible="tocVisible"
    :left-area-title="langConfig.toc.title"
    :left-area-reverse="tocNavPositionRight"
    :mode="currentMode"
    @editor-wrapper-click="handleEditorWrapperClick"
    ref="containerEl"
  >
    <template #left-area>
      <scrollbar>
        <toc-nav />
      </scrollbar>
    </template>
    <template #toolbars>
      <v-md-editor-toolbars
        :disabled-menus="disabledMenus"
        :toolbar="toolbar"
        :left-toolbar="leftToolbar"
        :right-toolbar="rightToolbar"
      >
        <template v-for="button of customSlotButtons" #[button]="slotData">
          <slot :name="button" v-bind="slotData" />
        </template>
      </v-md-editor-toolbars>
    </template>
    <template #editor>
      <scrollbar type="editor" @scroll="handleEditorScroll" ref="editorScrollerEl">
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
      <scrollbar type="preview" ref="previewScrollerEl">
        <v-md-preview
          :text="text"
          :tab-size="tabSize"
          :scroll-container="getPreviewScrollContainer"
          :before-change="beforePreviewChange"
          @change="handleChange"
          @image-click="handlePreviewImageClick"
        />
      </scrollbar>
    </template>
    <v-md-upload-file v-if="hasUploadImage" :upload-config="uploadImgConfig" ref="uploadFile" />
  </v-md-container>
</template>

<script lang="ts">
import VMdEditorToolbars from '@/components/editor-toolbars.vue';
import TextareaEditor from '@/components/textarea-editor.vue';
import VMdContainer from '@/components/container.vue';
import VMdUploadFile from '@/components/upload-file.vue';
import { editorProps, editorEmits, shouldInheritAttrs } from './modules/common';
import { editorComponents } from './modules/editor/editorComponents';
import { toolbarProps } from './modules/toolbar';
import { uploadImageProps } from './modules/upload-image';
import { vModelProps, vModelEmits } from './modules/v-model';
import { fullScreenEmits, fullScreenProps } from './modules/fullscreen';

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
import useVModel from './modules/useText';
import useCommon from './modules/useCommon';
import useSyncScroll from './modules/useSyncScroll';
import useEditor from './modules/useEditor';
import useToc from './modules/useToc';
import useFullscreen from './modules/useFullscreen';
import useLang from './modules/useLang';
import useUploadImage from './modules/useUploadImage';
import useList from './modules/useList';
import LifecycleStage from './types/lifecycleStage';
import type BaseEditor from './classes/baseEditor';
import useEditorMode from './modules/useEditorMode';
import usePreview from './modules/usePreview';

export default defineComponent({
  name: 'v-md-editor',
  inheritAttrs: shouldInheritAttrs,
  props: {
    ...editorProps,
    ...toolbarProps,
    ...vModelProps,
    ...uploadImageProps,
    ...fullScreenProps,
    modelValue: String,
  },
  emits: [...editorEmits, ...vModelEmits, ...fullScreenEmits],
  components: {
    [TextareaEditor.name]: TextareaEditor,
    VMdEditorToolbars,
    VMdContainer,
    VMdUploadFile,
    ...editorComponents(),
  },
  setup(props, ctx) {
    const textEditorMinHeight = ref<string>();
    const containerEl = ref();

    const customSlotButtons = Object.keys(props.toolbar).filter((btn) => props.toolbar[btn].slot);

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

    const {
      handleChange,
      handleBlur,
      handlePreviewImageClick,
      setFocusEnd: handleEditorWrapperClick,
    } = useCommon(ctx, props);

    const { currentMode } = useEditorMode();

    const { modelValue } = toRefs(props);
    const { text } = useVModel(modelValue.value);
    const { callLifeCycleHooks } = useEditor<BaseEditor>('base', ctx);

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

    const { handleInput } = useVModel();

    useList();
    const { tocVisible } = useToc();
    const { handleEditorScroll } = useSyncScroll();
    const { getPreviewScrollContainer } = usePreview();
    const { fullscreen } = useFullscreen(ctx, { fullscreen: props.defaultFullscreen });
    const { langConfig } = useLang();
    const { uploadImageConfig, disabledMenus } = toRefs(props);
    const { handleDrop, handlePaste, hasUploadImage, uploadImgConfig } = useUploadImage(
      ctx,
      uploadImageConfig.value,
      disabledMenus
    );

    return {
      handleEditorScroll,
      handleInput,
      handleDrop,
      handlePaste,
      hasUploadImage,
      uploadImgConfig,
      handleBlur,
      handleChange,
      getPreviewScrollContainer,
      handleEditorWrapperClick,
      handlePreviewImageClick,
      customSlotButtons,
      textEditorMinHeight,
      currentMode,
      fullscreen,
      tocVisible,
      langConfig,
      text,
    };
  },
});

// createEditor(component);
</script>
