<script setup lang="ts">
import EditorToolbar from '@/components/toolbar.vue';
import useToolbar from '@/modules/useToolbar';
import { computed, toRefs } from 'vue';

const props = withDefaults(
  defineProps<{
    disabledMenus: string[];
    toolbar: Record<string, any>;
    leftToolbar: string;
    rightToolbar: string;
  }>(),
  {
    leftToolbar:
      'undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | save',
    rightToolbar: 'preview toc sync-scroll fullscreen',
  }
);

const { toolbars, registerToolbars } = useToolbar();
registerToolbars(props.toolbar);

const getToolbarConfig = (toolbarStr: string) => {
  return toolbarStr
    .split('|')
    .map((group) => group.split(' ').filter((toolbarName) => toolbarName && toolbars[toolbarName]));
};

const { leftToolbar, rightToolbar } = toRefs(props);
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
</script>
<template>
  <editor-toolbar
    class="v-md-editor__toolbar-left"
    :disabled-menus="disabledMenus"
    :groups="leftToolbarGroup"
  >
    <template v-for="button of leftToolbarCustomSlots" #[button]="slotData">
      <slot :name="button" v-bind="slotData" />
    </template>
  </editor-toolbar>

  <editor-toolbar
    class="v-md-editor__toolbar-right"
    :disabled-menus="disabledMenus"
    :groups="rightToolbarGroup"
  >
    <template v-for="button of rightToolbarCustomSlots" #[button]="slotData">
      <slot :name="button" v-bind="slotData" />
    </template>
  </editor-toolbar>
</template>
