<template>
  <li
    class="v-md-editor__toolbar-item"
    :class="[
      !$slots['customIcon'] ? icon : '',
      `v-md-editor__toolbar-item-${name}`,
      {
        'v-md-editor__toolbar-item--active': active || menuActive,
      },
      {
        'v-md-editor__toolbar-item--menu': hasMenu,
      },
    ]"
    v-clickoutside:hideMenu="hideMenu"
    @mousedown="preventNativeClick ? $event.preventDefault() : undefined"
    @mouseleave="handleHideTooltip"
    @mouseenter="showTooltip"
    @click="handleToolbarItemClick(name)"
    ref="toolbarItemEl"
  >
    {{ text }}
    <slot name="icon" />
    <v-md-tooltip
      ref="tooltipEl"
      :text="title"
      :visible="tooltipVisible"
      :position="tooltipPosition"
    />
    <v-md-menu
      v-if="hasMenu"
      ref="menu"
      :mode="menuMode"
      :menus="menuItems"
      :item-width="menuObject.itemWidth"
      :row-num="menuObject.rowNum"
      :visible="menuActive"
      @update:visible="menuActive = $event"
      @item-click="handleToolbarMenuClick(name)"
    />
    <i v-if="hasMenu" class="v-md-icon-arrow-down v-md-editor__menu-ctrl" ref="menuCtrlEl" />
  </li>
</template>

<script lang="ts">
import Tooltip from './tooltip.vue';
import Menu from './menu.vue';
import Clickoutside from '@/utils/clickoutside';
import MENU_MODE from '@/utils/constants/menu-mode';
import { computed, defineComponent, ref, toRefs } from 'vue';
import VueTypes, { oneOfType } from 'vue-types';
import useToolbar from '@/modules/useToolbar';
import Position from '@/types/tooltipPositionType';

type MenuObject = { items: any; mode: any; itemWidth: number; rowNum: number };

export default defineComponent({
  name: 'toolbar-item',
  directives: { Clickoutside },
  components: {
    [Tooltip.name]: Tooltip,
    [Menu.name]: Menu,
  },
  props: {
    name: VueTypes.string.isRequired,
    title: String,
    active: Boolean,
    text: String,
    icon: String,
    menus: oneOfType<Array<any> | MenuObject>([Array, Object]).isRequired,
    disabledMenus: Array,
    preventNativeClick: VueTypes.bool.def(true),
  },
  setup(props, { emit }) {
    const menuActive = ref(false);
    const { name, menus, disabledMenus, preventNativeClick } = toRefs(props);
    const { handleToolbarItemClick, handleToolbarMenuClick } = useToolbar();

    const menuObject = computed(() => {
      return typeof menus.value == 'object'
        ? <MenuObject>menus.value
        : {
            items: [],
            mode: undefined,
            itemWidth: 0,
            rowNum: 0,
          };
    });

    const menuItems = computed(() => {
      const _menus = typeof menus.value == 'object' ? (<MenuObject>menus.value).items : menus;

      return _menus?.filter(
        ({ name: menuName }: { name: string }) =>
          !disabledMenus.value?.includes(`${name.value}/${menuName}`)
      );
    });

    const hasMenu = computed(() => menuItems.value?.length);
    const menuMode = computed(() => {
      return typeof menus.value == 'object' ? (<MenuObject>menus.value).mode : MENU_MODE.LIST;
    });

    const hideMenu = () => {
      if (hasMenu.value) {
        menuActive.value = false;
      }
    };

    const showMenu = () => {
      if (hasMenu.value) {
        menuActive.value = true;
      }
    };

    const handleClick = (e: MouseEvent) => {
      if (preventNativeClick.value) e.stopPropagation();
      emit('click');
      menuActive.value ? hideMenu() : showMenu();

      if (hasMenu.value) {
        handleHideTooltip();
      } else {
        showTooltip(e);
      }
    };

    const toolbarItemEl = ref();
    const menuCtrlEl = ref();
    const tooltipEl = ref();

    const timer = ref<NodeJS.Timeout>();

    const tooltipVisible = ref(false);
    const tooltipPosition = ref<Position>({
      x: 0,
      y: 0,
    });

    const showTooltip = (e: MouseEvent) => {
      const selfEl = toolbarItemEl.value.$el;
      const { target } = e;

      if ((target !== selfEl && target !== menuCtrlEl.value?.$el) || menuActive.value) {
        handleHideTooltip();

        return;
      }

      if (timer.value) clearTimeout(timer.value);

      const selfElRect = selfEl.getBoundingClientRect();
      const x = e.clientX - selfElRect.left;
      const y = e.clientY - selfElRect.top;

      timer.value = setTimeout(() => {
        tooltipPosition.value = {
          x: x - 2,
          y: y + 20,
        };
        tooltipVisible.value = true;
      }, 100);
    };

    const handleHideTooltip = () => {
      if (timer.value) clearTimeout(timer.value);
      tooltipVisible.value = false;
    };

    return {
      menuObject,
      menuActive,
      menuItems,
      hasMenu,
      menuMode,
      toolbarItemEl,
      menuCtrlEl,
      tooltipEl,
      tooltipVisible,
      tooltipPosition,
      hideMenu,
      showMenu,
      handleClick,
      showTooltip,
      handleHideTooltip,
      handleToolbarItemClick,
      handleToolbarMenuClick,
    };
  },
});
</script>

<style lang="scss">
@import '@/styles/var';

$item-height: 28px;

.v-md-editor {
  &__menu-ctrl {
    position: absolute;
    top: 0;
    right: 0;
    display: none;
  }

  &__toolbar-item {
    position: relative;
    height: $item-height;
    padding: 0 6px;
    color: $toolbar-text-color;
    font-size: $toolbar-font-size;
    line-height: $item-height;
    text-align: center;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s linear 0s;

    &:not(:first-child) {
      margin-left: 4px;
    }

    &:hover {
      background: $toolbar-hover-background;
    }

    &--menu {
      padding-right: 16px;

      .v-md-editor__menu-ctrl {
        display: inline-block;
      }
    }

    &--active {
      background: $toolbar-active-background;

      &:hover {
        background: $toolbar-active-background;
      }
    }
  }
}
</style>
