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
    ref="contaner"
  >
    <template
      v-for="button of customSlotButtons"
      #[button]="slotData"
    >
      <slot
        :name="button"
        v-bind="slotData"
      />
    </template>
    <template #left-area>
    <scrollbar>
      <toc-nav
        :titles="titles"
        @nav-click="handleNavClick"
      />
    </scrollbar>
    </template>
    <template #editor>
      <scrollbar
      @scroll="handleEditorScroll"
      ref="editorScroller"
    >
      <v-md-textarea-editor
        :value="text"
        :placeholder="placeholder"
        @input="handleInput"
        @click.native.stop
        @drop.native="handleDrop"
        @paste="handlePaste"
        ref="editorEgine"
      />
    </scrollbar>
    </template>
    <template #preview>
      <scrollbar ref="previewScroller">
      <v-md-preview
        :text="text"
        :tab-size="tabSize"
        :scroll-container="getPreviewScrollContainer"
        @change="handleChange"
        @image-click="handlePreviewImageClick"
        ref="preview"
      />
    </scrollbar>
    </template>
    
    <v-md-upload-file
      v-if="hasUploadImage"
      :upload-config="uploadConfig"
      ref="uploadFile"
    />
  </v-md-container>
</template>

<script>
import TextareaEditor from '@/components/textarea-editor';

import createEditor from './create-editor';

const component = {
  components: {
    [TextareaEditor.name]: TextareaEditor,
  },
  watch: {
    value() {
      this.text = this.value;
    },
  },
  computed: {
    customSlotButtons() {
      const { toolbar } = this;
      return Object.keys(toolbar).filter(btn => toolbar[btn].slot);
    },
  },
  data() {
    return {
      textEditorMinHeight: '',
    };
  },
  methods: {
    handleEditorWrapperClick() {
      this.setFocusEnd();
    },
    // Must implement
    editorFocusEnd() {
      this.focus();

      this.$refs.editorEgine.setRange({
        start: this.text.length,
        end: this.text.length,
      });
    },
    // Must implement
    delLineLeft() {
      const { editorEgine } = this.$refs;
      const { start } = editorEgine.getRange();

      const leftText = this.getCursorLineLeftText();
      editorEgine.setRange({ start: start - leftText.length - 1, end: start });
      this.replaceSelectionText('\n');
    },
    // Must implement
    getCursorLineLeftText() {
      const { start, end } = this.$refs.editorEgine.getRange();

      return start === end ? this.text.slice(0, start).split('\n').pop() : null;
    },
    // Must implement
    editorRegisterHotkeys(...arg) {
      this.$refs.editorEgine.registerHotkeys(...arg);
    },
    // Must implement
    editorScrollToTop(scrollTop) {
      this.$refs.editorScroller.scrollTo(scrollTop);
    },
    // Must implement
    getScrollInfo() {
      return this.$refs.editorScroller.getScrollInfo();
    },
    // Must implement
    heightAtLine(...arg) {
      return this.$refs.editorEgine.heightAtLine(...arg);
    },
    // Must implement
    focus() {
      this.$refs.editorEgine.focus();
    },
    // Must implement
    undo() {
      this.$refs.editorEgine.undo();
    },
    // Must implement
    redo() {
      this.$refs.editorEgine.redo();
    },
    // Must implement
    clear() {
      this.focus();

      this.handleInput('');
    },
    // Must implement
    replaceSelectionText(text) {
      this.$refs.editorEgine.insertText(text);
    },
    // Must implement
    getCurrentSelectedStr() {
      const { start, end } = this.$refs.editorEgine.getRange();

      return end > start ? this.text.slice(start, end) : null;
    },
    // Must implement
    changeSelctionTo(insertText, selectedText) {
      const { editorEgine } = this.$refs;
      const selectedIndexOfStr = insertText.indexOf(selectedText);
      const cursorEndIndex = editorEgine.getRange().end;

      if (selectedIndexOfStr === -1) return;

      const text = this.text.slice(0, cursorEndIndex);
      const insertTextIndex = text.length - insertText.length;
      const rangeStartIndex = insertTextIndex + selectedIndexOfStr;
      const rangeEndIndex = rangeStartIndex + selectedText.length;

      this.$refs.editorEgine.setRange({
        start: rangeStartIndex,
        end: rangeEndIndex,
      });
    },
  },
};

createEditor(component);

export default component;
</script>
