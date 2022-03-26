<template>
  <v-md-container
    :height="height"
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
          <base-editor
            v-model="text"
            :height="height"
            @drop="handleDrop"
            @paste="handlePaste"
            @blur="$emit('blur', $event)"
            ref="baseEditorComponent"
          />
        </template>
        <template #loading>loading..</template>
      </Suspense>
      <Suspense v-else-if="editorType == 'codemirror'">
        <template #default>
          <code-mirror-editor
            v-model="text"
            :placeholder="placeholder"
            :tab-size="tabSize"
            :codemirror-config="codemirrorConfig"
            :codemirror-style-reset="codemirrorStyleReset"
            :code-mirror="CodeMirror"
            @drop="handleDrop"
            @paste="handlePaste"
            @blur="$emit('blur', $event)"
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
          @change="$emit('change', $event)"
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
  defineAsyncComponent,
  ref,
  provide,
  shallowRef,
  nextTick,
} from 'vue';
import useLang from './modules/useLang';
import LifecycleStage from './types/lifecycleStage';
import State, { StateSymbol } from './classes/state';
import { array, object } from 'vue-types';
import type CodeMirror from '@/types/codeMirrorInstance';
import type Install from '@/types/installType';
import type PluginCreatorParams from '@/types/pluginCreationFnParams';
import { ThemeConfigOption } from './types/editorConfig';
import EDITOR_MODE from '@/utils/constants/editor-mode';

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
    CodeMirror: object<CodeMirror>(),
    plugins: array<{
      plugin: Install;
      params?: PluginCreatorParams;
    }>().def([]),
    theme: object<ThemeConfigOption>().isRequired,
  },
  emits: [...editorEmits, ...vModelEmits, ...fullScreenEmits, 'change', 'save', 'image-click'],
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
    const { emit } = ctx;
    const customSlotButtons = Object.keys(props.toolbar).filter((btn) => props.toolbar[btn].slot);

    const stateObj = new State(ctx);
    stateObj.fullScreen.active.value = props.defaultFullscreen;

    watch(
      () => props.mode,
      (newValue) => newValue && (stateObj.currentMode.value = newValue),
      {
        immediate: true,
      }
    );

    watch(
      () => stateObj.currentMode.value,
      async (newValue) => {
        if (newValue === EDITOR_MODE.EDITABLE && stateObj.syncScroll.enableSyncScroll.value) {
          await nextTick();
          stateObj.syncScroll.previewSyncScroll();
        }
      },
      {
        flush: 'post',
      }
    );

    stateObj.installTheme(props.theme);
    stateObj.installPlugins(props.plugins);
    const state = shallowRef<State>(stateObj);

    provide(StateSymbol, state);

    watch(
      () => props.modelValue,
      (v) => (state.value.text.value = v),
      {
        immediate: true,
      }
    );

    const baseEditorComponent = ref();
    const codeMirrorComponent = ref();

    const handleContainerResize = () => {
      codeMirrorComponent.value?.handleContainerResize();
    };

    const handlePreviewImageClick = (images: Array<any>, currentIndex: number) => {
      emit('image-click', images, currentIndex);
    };

    const handleEditorWrapperClick = () => {
      props.editorType == 'base' && state.value.setFocusEnd();
    };

    const { callLifeCycleHooks } = stateObj.lifecycle;

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

    const { getPreviewScrollContainer } = stateObj.preview;
    const fullscreen = state.value?.fullScreen.active;
    const { langConfig } = useLang();
    const { hasUploadImage, uploadImgConfig, handleDrop, handlePaste } = stateObj.imageUpload;

    return {
      baseEditorComponent,
      codeMirrorComponent,
      hasUploadImage,
      uploadImgConfig,
      handleContainerResize,
      getPreviewScrollContainer,
      handleEditorWrapperClick,
      handlePreviewImageClick,
      handleDrop,
      handlePaste,
      customSlotButtons,
      currentMode: stateObj.currentMode,
      fullscreen,
      tocVisible: stateObj.tocVisible,
      langConfig,
      text: state.value.text,
    };
  },
});
</script>
