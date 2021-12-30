<template>
  <v-md-container
    :left-toolbar="leftToolbar"
    :right-toolbar="rightToolbar"
    :toolbars="toolbars"
    :disabled-menus="disabledMenus"
    :height="height"
    :fullscreen="fullscreen"
    :left-area-visible="tocVisible"
    :left-area-title="langConfig.toc.title"
    :left-area-reverse="tocNavPositionRight"
    :mode="currentMode"
    @editor-wrapper-click="handleEditorWrapperClick"
    @toolbar-item-click="handleToolbarItemClick"
    @toolbar-menu-click="handleToolbarMenuClick"
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
          @drop="handleDrop"
          @paste="handlePaste"
          @blur="handleBlur"
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
    <v-md-upload-file v-if="hasUploadImage" :upload-config="uploadConfig" ref="uploadFile" />
  </v-md-container>
</template>

<script lang="ts">
import TextareaEditor from '@/components/textarea-editor.vue';
import createEditor from './create-editor';
import {
  editorProps,
  editorEmits,
  editorComponents,
  shouldInheritAttrs,
  useCommonEditor,
} from './modules/common';
import { toolbarProps } from './modules/toolbar';
import { vModelProps, vModelEmits } from './modules/v-model';

import { inBrowser } from '@/utils/util';
import { computed, defineComponent, nextTick, ref, watch } from 'vue';
import useToolbarItems from './modules/useToolbarItems';
import useToolbar from './modules/useToolbar';
import useVModel from './modules/useVModel';
import useCommon from './modules/useCommon';
import useSyncScroll from './modules/useSyncScroll';

export default defineComponent({
  name: 'v-md-editor',
  inheritAttrs: shouldInheritAttrs,
  props: {
    ...editorProps,
    ...toolbarProps,
    ...vModelProps,
    modelValue: String,
  },
  emits: [...editorEmits, ...vModelEmits],
  components: {
    [TextareaEditor.name]: TextareaEditor,
    ...editorComponents,
  },
  setup(props, { emit }) {
    const {} = useCommonEditor(props.mode);
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

    const { addDefaultToolbars, handleToolbarItemClick, handleToolbarMenuClick } = useToolbar();
    addDefaultToolbars();

    const customSlotButtons = computed(() =>
      Object.keys(props.toolbar).filter((btn) => toolbar[btn].slot)
    );

    const { setFocusEnd, mode } = useCommon();
    mode.value = props.mode;
    const { previewScrollTo } = useSyncScroll();
    const handleEditorWrapperClick = () => {
      setFocusEnd({
        editorFocusEnd,
        editorScrollToTop,
        previewScrollTo,
      });
    };

    const editorEngine = ref();
    const { text } = useVModel();

    // Must implement
    const editorFocusEnd = () => {
      focus();

      editorEngine.value.setRange({
        start: text.value.length,
        end: text.value.length,
      });
    };
    // Must implement
    const delLineLeft = () => {
      const { start } = editorEngine.value.getRange();

      const leftText = getCursorLineLeftText();
      editorEngine.value.setRange({ start: start - leftText.length - 1, end: start });
      replaceSelectionText('\n');
    };
    // Must implement
    const getCursorLineLeftText = () => {
      const { start, end } = editorEngine.value.getRange();

      return start === end ? text.value.slice(0, start).split('\n').pop() : null;
    };
    // Must implement
    const editorRegisterHotkeys = (...arg) => {
      editorEngine.value.registerHotkeys(...arg);
    };

    const editorScroller = ref();
    // Must implement
    const editorScrollToTop = (scrollTop) => {
      editorScroller.value.scrollTo(scrollTop);
    };
    // Must implement
    const getScrollInfo = () => {
      return editorScroller.value.getScrollInfo();
    };
    // Must implement
    const heightAtLine = (...arg) => {
      return editorEngine.value.heightAtLine(...arg);
    };
    // Must implement
    const focus = () => {
      editorEngine.value.focus();
    };
    // Must implement
    const undo = () => {
      editorEngine.value.undo();
    };
    // Must implement
    const redo = () => {
      editorEngine.value.redo();
    };

    const { handleInput } = useVModel();
    // Must implement
    const clear = () => {
      focus();

      handleInput('', emit);
    };
    // Must implement
    const replaceSelectionText = (text) => {
      editorEngine.value.insertText(text);
    };
    // Must implement
    const getCurrentSelectedStr = () => {
      const { start, end } = editorEngine.value.getRange();

      return end > start ? text.value.slice(start, end) : null;
    };
    // Must implement
    const changeSelectionTo = (insertText, selectedText) => {
      const selectedIndexOfStr = insertText.indexOf(selectedText);
      const cursorEndIndex = editorEngine.value.getRange().end;

      if (selectedIndexOfStr === -1) return;

      const textSliced = text.value.slice(0, cursorEndIndex);
      const insertTextIndex = textSliced.length - insertText.length;
      const rangeStartIndex = insertTextIndex + selectedIndexOfStr;
      const rangeEndIndex = rangeStartIndex + selectedText.length;

      editorEngine.value.setRange({
        start: rangeStartIndex,
        end: rangeEndIndex,
      });
    };

    return {
      handleEditorWrapperClick,
      handleToolbarItemClick,
      handleToolbarMenuClick,
      handleNavClick,
      handleEditorScroll,
      handleInput,
      handleDrop,
      handlePaste,
      handleBlur,
      getPreviewScrollContainer,
      handlePreviewImageClick,
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
