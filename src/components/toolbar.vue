<template>
  <ul v-if="groups.length">
    <template v-for="(group, idx) in groups">
      <toolbar-item
        v-for="itemName in group"
        :key="itemName"
        :name="itemName"
        :title="getConfig(itemName, 'title')"
        :icon="getConfig(itemName, 'icon')"
        :text="getConfig(itemName, 'text')"
        :active="getConfig(itemName, 'active')"
        :menus="getConfig(itemName, 'menus')"
        :prevent-native-click="getConfig(itemName, 'preventNativeClick')"
        :disabled-menus="disabledMenus"
      >
        <template #icon>
          <slot :name="itemName" />
        </template>
      </toolbar-item>
      <li v-if="idx !== groups.length - 1" class="v-md-editor__toolbar-divider" />
    </template>
  </ul>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue';
import ToolbarItem from '@/components/toolbar-item/index.vue';
import useToolbar from '@/modules/useToolbar';
import Toolbar from '@/types/toolbarType';
import useToolbarItems from '@/modules/useToolbarItems';
import { string } from 'vue-types';

export default defineComponent({
  name: 'editor-toolbar',
  components: {
    [ToolbarItem.name]: ToolbarItem,
  },
  props: {
    disabledMenus: Array,
    toolbarType: string<'left' | 'right'>().isRequired,
  },
  setup(props) {
    const { toolbars } = useToolbar();
    const { getToolbarItems } = useToolbarItems();

    const getConfig = (itemName: string, configName: keyof Toolbar) => {
      const toolbarConfig = toolbars[itemName];
      const value = toolbarConfig[configName];

      return typeof value === 'function' ? value() : value;
    };

    const toolbarItems = getToolbarItems(props.toolbarType);
    const getToolbarConfig = (toolbarStr: string) => {
      return toolbarStr
        .split('|')
        .map((group) =>
          group.split(' ').filter((toolbarName) => toolbarName && toolbars[toolbarName])
        );
    };
    const groups = computed(() => getToolbarConfig(toolbarItems));

    return {
      toolbars,
      groups,
      getConfig,
    };
  },
});
</script>

<style lang="scss">
@import '@/styles/var';

.v-md-editor {
  &__toolbar {
    display: flex;
    justify-content: space-between;
    box-sizing: border-box;
    width: 100%;
    padding: 6px;
    border-bottom: 1px solid $border-color;

    &-left,
    &-right {
      display: flex;
      flex-wrap: wrap;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    &-left + &-right {
      margin-left: 60px;
    }

    &-divider {
      position: relative;
      height: 28px;
      margin: 0 10px;

      + li.v-md-editor__toolbar-item {
        margin-left: 0;
      }

      &::before {
        position: absolute;
        top: 4px;
        bottom: 4px;
        border-left: 1px solid $border-color;
        content: '';
      }
    }
  }
}
</style>
