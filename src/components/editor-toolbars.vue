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

<script lang="ts">
import { StateSymbol } from '@/classes/state';
import EditorToolbar from '@/components/toolbar.vue';
import Toolbar from '@/types/toolbarType';
import { computed, defineComponent, inject, toRefs } from 'vue';
import { array, object, string } from 'vue-types';

export default defineComponent({
  components: {
    EditorToolbar,
  },
  props: {
    disabledMenus: array<string>().isRequired,
    toolbar: object<Record<string, Toolbar>>().isRequired,
    leftToolbar: string().def(
      'undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | save'
    ),
    rightToolbar: string().def('preview toc sync-scroll fullscreen'),
  },
  setup(props) {
    const state = inject(StateSymbol)!;
    const { toolbars, registerToolbars } = state.value.toolbarManager;
    registerToolbars(props.toolbar);

    const getToolbarConfig = (toolbarStr: string) => {
      return toolbarStr
        .split('|')
        .map((group) =>
          group.split(' ').filter((toolbarName) => toolbarName && toolbars[toolbarName])
        );
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

    return {
      leftToolbarGroup,
      rightToolbarGroup,
      leftToolbarCustomSlots,
      rightToolbarCustomSlots,
    };
  },
});
</script>
