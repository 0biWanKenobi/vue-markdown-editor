<template>
  <div
    class="v-md-editor"
    :class="[
      `v-md-editor--${mode}`,
      {
        'v-md-editor--fullscreen': fullscreen,
        'v-md-editor--left-area-reverse': leftAreaReverse,
      },
    ]"
    :style="{ height: heightGetter }"
  >
    <div
      v-show="!isPreviewMode"
      class="v-md-editor__left-area"
      :style="{
        width: leftAreaVisible ? leftAreaWidth : 0,
        borderWidth: leftAreaVisible ? '1px' : 0,
      }"
    >
      <div
        class="v-md-editor__left-area-title"
        :style="{
          height: `${toolbarHeight}px`,
          lineHeight: `${toolbarHeight}px`,
        }"
      >
        {{ leftAreaTitle }}
      </div>
      <div class="v-md-editor__left-area-body">
        <slot name="left-area" />
      </div>
    </div>
    <div class="v-md-editor__right-area">
      <div v-show="!isPreviewMode" class="v-md-editor__toolbar" ref="toolbarWrapper">
        <editor-toolbar
          class="v-md-editor__toolbar-left"
          toolbarType="left"
          :disabled-menus="disabledMenus"
        >
          <template v-for="button of leftToolbarCustomSlots" #[button]="slotData">
            <slot :name="button" v-bind="slotData" />
          </template>
        </editor-toolbar>
        <editor-toolbar
          class="v-md-editor__toolbar-right"
          tytoolbarTypepe="right"
          :disabled-menus="disabledMenus"
        >
          <template v-for="button of rightToolbarCustomSlots" #[button]="slotData">
            <slot :name="button" v-bind="slotData" />
          </template>
        </editor-toolbar>
      </div>
      <div class="v-md-editor__main">
        <div
          ref="editorWrapper"
          class="v-md-editor__editor-wrapper"
          v-show="!isPreviewMode"
          @click="handleEditorWrapperClick"
        >
          <slot name="editor" />
        </div>
        <div v-show="!isEditMode" class="v-md-editor__preview-wrapper" ref="previewWrapper">
          <slot name="preview" />
        </div>
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Toolbar from '@/components/toolbar.vue';
import { addResizeListener, removeResizeListener } from '@/utils/resize-event';
import EDITOR_MODE from '@/utils/constants/editor-mode';
import { computed, defineComponent, onBeforeUnmount, onMounted, toRefs, ref } from 'vue';
import useToolbar from '@/modules/useToolbar';
import useCommon from '@/modules/useCommon';
import useToolbarItems from '@/modules/useToolbarItems';
import VueTypes from 'vue-types';

export default defineComponent({
  name: 'v-md-container',
  components: {
    [Toolbar.name]: Toolbar,
  },
  props: {
    fullscreen: Boolean,
    height: String,
    noresize: Boolean,
    disabledMenus: Array,
    leftAreaVisible: Boolean,
    leftAreaTitle: String,
    leftAreaReverse: Boolean,
    leftAreaWidth: VueTypes.string.def('200px'),
    mode: VueTypes.string.def(EDITOR_MODE.EDITABLE),
  },
  emits: ['resize'],
  setup(props, { emit }) {
    const toolbarHeight = ref(0);

    const { fullscreen, height } = toRefs(props);
    const heightGetter = computed(() => (fullscreen.value ? 'auto' : height.value));

    const { toolbars } = useToolbar();
    const getToolbarConfig = (toolbarStr: string) => {
      return toolbarStr
        .split('|')
        .map((group) =>
          group.split(' ').filter((toolbarName) => toolbarName && toolbars[toolbarName])
        );
    };

    const { leftToolbarItems: leftToolbar, rightToolbarItems: rightToolbar } = useToolbarItems();
    const leftToolbarGroup = computed(() => getToolbarConfig(leftToolbar.value));

    const leftToolbarCustomSlots = computed(() => {
      const buttons = leftToolbarGroup.value.flat();
      return buttons.filter((btn) => !!toolbars[btn].slot);
    });

    const rightToolbarGroup = computed(() => getToolbarConfig(rightToolbar.value));

    const rightToolbarCustomSlots = computed(() => {
      const buttons = rightToolbarGroup.value.flat();
      return buttons.filter((btn) => !!toolbars[btn].slot);
    });

    const { mode } = toRefs(props);
    const isPreviewMode = computed(() => mode.value == EDITOR_MODE.PREVIEW);
    const isEditMode = computed(() => mode.value == EDITOR_MODE.EDIT);

    const editorWrapper = ref();
    const toolbarWrapper = ref();

    const { setFocusEnd: handleEditorWrapperClick } = useCommon();

    const handleResize = () => {
      emit('resize');
    };

    const handleToolbarWrapperResize = () => {
      if (toolbarWrapper.value) toolbarHeight.value = toolbarWrapper.value.offsetHeight;
    };

    const { noresize } = toRefs(props);

    onMounted(() => {
      if (noresize.value) return;
      addResizeListener(editorWrapper.value, handleResize);
      addResizeListener(toolbarWrapper.value, handleToolbarWrapperResize);
    });

    onBeforeUnmount(() => {
      if (noresize.value) return;
      removeResizeListener(editorWrapper, handleResize);
      removeResizeListener(toolbarWrapper, handleToolbarWrapperResize);
    });

    return {
      toolbarHeight,
      heightGetter,
      leftToolbarGroup,
      leftToolbarCustomSlots,
      rightToolbarGroup,
      rightToolbarCustomSlots,
      isPreviewMode,
      isEditMode,
      toolbarWrapper,
      editorWrapper,
      handleEditorWrapperClick,
    };
  },
});
</script>

<style lang="scss">
@import '@/styles/var';

.v-md-editor {
  display: flex;
  width: 100%;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: $box-shadow-light;

  &__left-area,
  &__right-area {
    display: flex;
    flex-direction: column;
    width: 200px;
  }

  &__left-area {
    height: 100%;
    overflow: hidden;
    border-right: 1px solid $border-color;
    transition: 0.3s;

    &-title {
      position: relative;
      height: 41px;
      padding: 0 14px;
      color: $text-color;
      font-weight: 600;
      font-size: 16px;
      line-height: 41px;
      white-space: nowrap;

      &::after {
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        border-bottom: 1px solid $border-color;
        content: '';
      }
    }

    &-body {
      flex: 1;
      padding: 8px 14px;
      overflow: hidden;
    }
  }

  &--left-area-reverse {
    flex-direction: row-reverse;
  }

  &--left-area-reverse &__left-area {
    border-right: none;
    border-left: 1px solid $border-color;
  }

  &__right-area {
    flex: 1;
  }

  &--preview {
    box-shadow: none;
  }

  &--fullscreen {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1001;
  }

  &__main {
    display: flex;
    flex: 1;
    width: 100%;
    overflow: hidden;
  }

  &__editor-wrapper,
  &__preview-wrapper {
    position: relative;
    flex: 1;
    height: 100%;
    overflow: hidden;
  }

  &__editor-wrapper {
    cursor: text;
    user-select: none;
  }

  &--editable &__editor-wrapper {
    border-right: 1px solid $border-color;
  }
}
</style>
