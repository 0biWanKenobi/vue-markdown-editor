<template>
  <v-md-container
    :height="height"
    :fullscreen="fullscreen"
    :left-area-visible="tocVisible"
    :left-area-title="langConfig.toc.title"
    :left-area-reverse="tocNavPositionRight"
    :mode="currentMode"
    @editor-wrapper-click="handleEditorWrapperClick"
    @resize="handleContainerResize"
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
      <Suspense v-if="editorType == 'base'">
        <template #default>
          <base-editor :text="text" :height="height" />
        </template>
        <template #loading>loading..</template>
      </Suspense>
      <Suspense v-else-if="editorType == 'codemirror'">
        <template #default>
          <code-mirror-editor
            :text="text"
            :placeholder="placeholder"
            :tab-size="tabSize"
            :codemirror-config="codemirrorConfig"
            :codemirror-style-reset="codemirrorStyleReset"
            ref="codeMirrorComponent"
          />
        </template>
        <template #loading>loading..</template>
      </Suspense>
      <div v-else>
        <pre>
          'editorType' prop should be 'base' or 'codemirror', cannot be {{ editorType }}.
        </pre>
      </div>
    </template>
    <template #preview>
      <scrollbar type="preview">
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
    <v-md-upload-file v-if="hasUploadImage" :upload-config="uploadImgConfig" />
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

import {
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  watch,
  toRefs,
  defineAsyncComponent,
  ref,
} from 'vue';
import useVModel from './modules/useText';
import useCommon from './modules/useCommon';
import useEditor from './modules/useEditor';
import useToc from './modules/useToc';
import useFullscreen from './modules/useFullscreen';
import useLang from './modules/useLang';
import useUploadImage from './modules/useUploadImage';
import useList from './modules/useList';
import LifecycleStage from './types/lifecycleStage';
import useEditorMode from './modules/useEditorMode';
import usePreview from './modules/usePreview';

const BaseEditor = defineAsyncComponent(() => import('@/base-editor.vue'));
const CodeMirrorEditor = defineAsyncComponent(() => import('@/codemirror-editor.vue'));

export default defineComponent({
  name: 'v-md-root',
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
    BaseEditor,
    CodeMirrorEditor,
    [TextareaEditor.name]: TextareaEditor,
    VMdEditorToolbars,
    VMdContainer,
    VMdUploadFile,
    ...editorComponents(),
  },
  setup(props, ctx) {
    // const containerEl = ref();

    const customSlotButtons = Object.keys(props.toolbar).filter((btn) => props.toolbar[btn].slot);

    watch(
      () => props.modelValue,
      (v) => (text.value = v)
    );

    const { handleChange, handlePreviewImageClick, setFocusEnd } = useCommon(ctx, props);

    const handleEditorWrapperClick = () => {
      props.editorType == 'base' && setFocusEnd();
    };

    const { currentMode } = useEditorMode();

    const { modelValue } = toRefs(props);
    const { text } = useVModel(modelValue.value);
    const { callLifeCycleHooks } = useEditor();

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

    useList();
    const { tocVisible } = useToc();
    const { getPreviewScrollContainer } = usePreview();
    const { fullscreen } = useFullscreen(ctx, { fullscreen: props.defaultFullscreen });
    const { langConfig } = useLang();
    const { hasUploadImage, uploadImgConfig } = useUploadImage();

    const codeMirrorComponent = ref();
    const handleContainerResize = () => {
      codeMirrorComponent.value?.handleContainerResize();
    };

    return {
      codeMirrorComponent,
      hasUploadImage,
      uploadImgConfig,
      handleContainerResize,
      handleChange,
      getPreviewScrollContainer,
      handleEditorWrapperClick,
      handlePreviewImageClick,
      customSlotButtons,
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
