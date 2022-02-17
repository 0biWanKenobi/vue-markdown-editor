<template>
  <div
    class="codemirror-wrapper"
    :class="{
      'codemirror-reset': codemirrorStyleReset,
    }"
    ref="codemirrorEditorEl"
  />
</template>

<script lang="ts">
import {
  defineComponent,
  inject,
  markRaw,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  toRefs,
  unref,
  watch,
} from 'vue';
import VueTypes from 'vue-types';
import useCodemirror from './modules/useCodemirror';
import useSyncScroll from './modules/useSyncScroll';
import CodemirrorEditor from './classes/codemirrorEditor';
import { codemirrorEditorProps, editorEmits, sharedEditorProps } from './modules/common';
import { vModelEmits } from './modules/v-model';
import IEditor from './interfaces/IEditor';
import { StateSymbol } from './classes/state';

export default defineComponent({
  name: 'v-md-editor',
  props: {
    ...sharedEditorProps,
    ...codemirrorEditorProps,
    modelValue: VueTypes.string.def(''),
  },
  emits: [...editorEmits, ...vModelEmits],
  setup(props, ctx) {
    const { emit } = ctx;
    const editorObj = new CodemirrorEditor();
    const editor = shallowRef<IEditor>(editorObj);
    const state = inject(StateSymbol)!;
    state.value.editor = editor.value;
    const codemirrorInstance = editorObj.codemirrorInstance;

    const { Codemirror, codemirrorInstance, hotkeysManager } = useCodemirror();

    const { codemirrorConfig, modelValue, tabSize, placeholder } = toRefs(props);

    const codemirrorEditorEl = ref();

    const { handleEditorScroll } = useSyncScroll();

    watch(
      () => modelValue.value,
      (v) => {
        emit('update:modelValue', v);
        codemirrorInstance.value.setValue(v);
      }
    );

    onBeforeUnmount(() => {
      const element = codemirrorInstance.value.doc.cm.getWrapperElement();
      element?.remove?.();
    });

    onMounted(async () => {
      if (!Codemirror)
        return console.error(
          '1.5.0与2.1.0版本之后Codemirror将由用户自己配置，请配置Codemirror，如何配置请参考相关文档'
        );
      await nextTick();
      const instance = new Codemirror(codemirrorEditorEl.value, {
        tabSize: unref(tabSize),
        lineNumbers: true,
        styleActiveLine: true,
        value: unref(modelValue),
        mode: 'markdown',
        lineWrapping: true,
        scrollbarStyle: 'overlay',
        autoCloseTags: true,
        matchBrackets: true,
        indentWithTabs: true,
        autoCloseBrackets: true,
        indentUnit: unref(tabSize),
        placeholder: unref(placeholder),
        ...unref(codemirrorConfig),
      });

      codemirrorInstance.value = markRaw(instance);

      codemirrorInstance.value.on('change', () => {
        const newValue = getValue();
        const { handleInput } = useVModel();
        handleInput(newValue);
      });

      codemirrorInstance.value.on('scroll', () => {
        handleEditorScroll();
      });

      codemirrorInstance.value.on('keydown', (_: any, e: KeyboardEvent) => {
        hotkeysManager.dispatch(e);
      });

      codemirrorInstance.value.on('drop', (_: any, e: DragEvent) => {
        emit('drop', e);
      });

      codemirrorInstance.value.on('paste', (_: any, e: ClipboardEvent) => {
        emit('paste', e);
      });

      codemirrorInstance.value.on('blur', (_: any, e: Event) => {
        emit('blur', e);
      });
    });

    const handleContainerResize = () => {
      if (!Codemirror) return;
      // 容器大小变化的时候刷新 codemirror 解决滚动条的显示问题
      codemirrorInstance.value.refresh();
    };
    const getValue = () => {
      return codemirrorInstance.value.getValue();
    };

    return {
      codemirrorEditorEl,
      handleContainerResize,
    };
  },
});

function useVModel(): { handleInput: any } {
  throw new Error('Function not implemented.');
}
// createEditor(component);

// export default component;
</script>

<style lang="scss">
@import 'styles/var';

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
