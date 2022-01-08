<template>
  <v-md-container
    :disabled-menus="disabledMenus"
    :height="height"
    :fullscreen="fullscreen"
    :left-area-visible="tocVisible"
    :left-area-title="langConfig.toc.title"
    :left-area-reverse="tocNavPositionRight"
    :mode="currentMode"
    @resize="handleContainerResize"
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
      <div
        class="codemirror-wrapper"
        :class="{
          'codemirror-reset': codemirrorStyleReset,
        }"
        ref="codemirrorEditorEl"
      />
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
    <v-md-upload-file v-if="hasUploadImage" :upload-config="uploadConfig" ref="uploadFile" />
  </v-md-container>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref, toRefs, watch } from 'vue';
import VueTypes from 'vue-types';
import { toolbarProps } from './modules/toolbar';
import { editorComponents, editorProps } from './modules/common';
import { uploadImageProps } from './modules/upload-image';
import useVModel from './modules/useVModel';
import useCodemirror from './modules/useCodemirror';
import useUploadImage from './modules/useUploadImage';
import useSyncScroll from './modules/useSyncScroll';
import useCommon from './modules/useCommon';
import useFullscreen from './modules/useFullscreen';
import useToc from './modules/useToc';
import useScroll from './modules/useScroll';
import useLang from './modules/useLang';
import useEditor from './modules/useEditor';
import type CodemirrorEditor from './classes/codemirrorEditor';
import '@/assets/css/font';

export default defineComponent({
  name: 'v-md-editor',
  components: {
    ...editorComponents(),
  },
  props: {
    ...editorProps,
    ...toolbarProps,
    ...uploadImageProps,
    codemirrorConfig: Object,
    codemirrorStyleReset: VueTypes.bool.def(true),
    modelValue: String,
  },
  setup(props, ctx) {
    const {
      editor: { previewEl, previewScrollerEl, codemirrorInstance, hotkeysManager },
    } = useEditor<CodemirrorEditor>('codemirror');

    const { codemirrorConfig, modelValue, tabSize, placeholder } = toRefs(props);
    const { text, handleInput } = useVModel();

    const { Codemirror } = useCodemirror();
    const codemirrorEditorEl = ref();

    const { uploadImageConfig } = toRefs(props);
    const { langConfig } = useLang();
    const { handleDrop, handlePaste, hasUploadImage } = useUploadImage(
      ctx,
      uploadImageConfig.value
    );

    const { handleEditorScroll } = useSyncScroll();
    const { getPreviewScrollContainer } = useScroll();
    const { uploadConfig, handleChange, handleBlur, handlePreviewImageClick, currentMode } =
      useCommon(ctx);

    watch(
      () => modelValue.value,
      (v) => {
        if (v !== text.value) {
          text.value = v;
          codemirrorInstance.value.setValue(text.value);
        }
      }
    );

    onBeforeUnmount(() => {
      const element = codemirrorInstance.value.doc.cm.getWrapperElement();
      element?.remove?.();
    });

    onMounted(() => {
      if (!Codemirror)
        return console.error(
          '1.5.0与2.1.0版本之后Codemirror将由用户自己配置，请配置Codemirror，如何配置请参考相关文档'
        );

      codemirrorInstance.value = new Codemirror(codemirrorEditorEl.value, {
        lineNumbers: true,
        styleActiveLine: true,
        autoCloseTags: true,
        matchBrackets: true,
        indentWithTabs: true,
        autoCloseBrackets: true,
        ...codemirrorConfig,
        tabSize: tabSize.value,
        indentUnit: tabSize.value,
        value: text.value,
        placeholder: placeholder.value,
        mode: 'markdown',
        lineWrapping: true,
        scrollbarStyle: 'overlay',
      });

      codemirrorInstance.value.on('change', () => {
        const newValue = getValue();

        handleInput(newValue);
      });

      codemirrorInstance.value.on('scroll', () => {
        handleEditorScroll();
      });

      codemirrorInstance.value.on('keydown', (_: any, e: KeyboardEvent) => {
        hotkeysManager.dispatch(e);
      });

      codemirrorInstance.value.on('drop', (_: any, e: DragEvent) => {
        handleDrop(e);
      });

      codemirrorInstance.value.on('paste', (_: any, e: ClipboardEvent) => {
        handlePaste(e);
      });

      codemirrorInstance.value.on('blur', (_: any, e: Event) => {
        handleBlur(e);
      });
    });

    const { toolbar } = toRefs(props);
    const { fullscreen } = useFullscreen(ctx);
    const { handleNavClick, tocVisible, titles } = useToc();
    const customSlotButtons = Object.keys(toolbar.value).filter((btn) => toolbar.value[btn].slot);

    const handleContainerResize = () => {
      if (!Codemirror) return;
      // 容器大小变化的时候刷新 codemirror 解决滚动条的显示问题
      codemirrorInstance.value.refresh();
    };
    const getValue = () => {
      return codemirrorInstance.value.getValue();
    };

    // Must implement
    const delLineLeft = () => {
      codemirrorInstance.value.execCommand('delLineLeft');
    };

    // Must implement
    const editorFocusEnd = () => {
      focus();

      const lastLineIndex = codemirrorInstance.value.lastLine();
      const lastLineContent = codemirrorInstance.value.getLine(lastLineIndex);

      codemirrorInstance.value.setCursor({ line: lastLineIndex, ch: lastLineContent.length });
    };

    return {
      text,
      fullscreen,
      tocVisible,
      titles,
      currentMode,
      langConfig,
      hasUploadImage,
      uploadConfig,
      customSlotButtons,
      previewEl,
      previewScrollerEl,
      handleChange,
      handleNavClick,
      handlePreviewImageClick,
      handleContainerResize,
      getPreviewScrollContainer,
    };
  },
});

// createEditor(component);

// export default component;
</script>

<style lang="scss">
@import '@/styles/var';

.v-md-editor {
  .codemirror-wrapper {
    height: 100%;

    .CodeMirror {
      height: 100%;
    }

    &.codemirror-reset {
      .CodeMirror {
        color: $text-color;
        font-size: $editor-font-size;
        font-family: $editor-font-family;
        line-height: $editor-line-height;

        &:hover {
          .CodeMirror-overlayscroll-vertical,
          .CodeMirror-overlayscroll-horizontal {
            & > div {
              opacity: 1;
            }
          }
        }

        pre {
          padding: 0 12px;
          word-break: break-all;
        }
      }

      .CodeMirror-empty {
        color: $text-color-placeholder;
      }

      .cm-header,
      .cm-url,
      .cm-link {
        color: #1890ff;
      }

      .cm-link {
        text-decoration: none;
      }

      .cm-url {
        text-decoration: underline;
      }

      .cm-quote,
      .cm-comment,
      .cm-variable-2:not(.cm-url),
      .cm-link {
        color: $text-color;
      }

      // 选中代码的高亮背景色
      .CodeMirror-selected {
        background: mix(#e8f2ff, #000, 90%);
      }

      .CodeMirror-linenumbers {
        padding: 0 5px;
      }

      // 滚动条样式
      .CodeMirror-overlayscroll-vertical,
      .CodeMirror-overlayscroll-horizontal {
        & > div {
          background-color: $scrollbar-background-color;
          border-radius: $scrollbar-border-radius;
          cursor: pointer;
          opacity: 0;
          transition: opacity $scrollbar-opacity-transition,
            background-color $scrollbar-background-transition;

          &:hover {
            background-color: $scrollbar-active-background-color;
          }
        }
      }

      .CodeMirror-overlayscroll-vertical {
        right: 2px;
      }
    }
  }
}
</style>
