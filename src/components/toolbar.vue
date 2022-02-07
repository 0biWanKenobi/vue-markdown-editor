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
        @click="onItemClick(itemName)"
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
import { defineComponent } from 'vue';
import ToolbarItem from '@/components/toolbar-item/index.vue';
import useToolbar from '@/modules/useToolbar';
import Toolbar from '@/types/toolbarType';
import { array } from 'vue-types';

export default defineComponent({
  name: 'editor-toolbar',
  components: {
    [ToolbarItem.name]: ToolbarItem,
  },
  props: {
    disabledMenus: Array,
    groups: array<string[]>().isRequired,
  },
  setup() {
    const onItemClick = (n: string) => {
      console.log(n);
    };

    const { toolbars } = useToolbar();

    const getConfig = (itemName: string, configName: keyof Toolbar) => {
      const toolbarConfig = toolbars[itemName];
      const value = toolbarConfig[configName];

      return typeof value === 'function' ? value() : value;
    };

    return {
      getConfig,
      onItemClick,
    };
  },
});
</script>

<style lang="scss">
@import '../styles/var';

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
