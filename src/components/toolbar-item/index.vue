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
    @click="handleItemClick($event)"
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
      :mode="menuObject.mode"
      :menus="menuObject.items"
      :item-width="menuObject.itemWidth"
      :row-num="menuObject.rowNum"
      :visible="menuActive"
      @update:visible="menuActive = $event"
      @item-click="handleMenuClick"
    />
    <i v-if="hasMenu" class="v-md-icon-arrow-down v-md-editor__menu-ctrl" ref="menuCtrlEl" />
  </li>
</template>

<script lang="ts">
import Tooltip from './tooltip.vue';
import VMdMenu from './menu.vue';
import Clickoutside from '@/utils/clickoutside';
import MENU_MODE from '@/utils/constants/menu-mode';
import { computed, defineComponent, ref, toRefs } from 'vue';
import VueTypes, { oneOfType } from 'vue-types';
import useToolbar from '@/modules/useToolbar';
import Position from '@/types/tooltipPositionType';
import Menu from '@/types/toolbarItemMenu';

type MenuObject = {
  items: Menu[];
  mode: keyof typeof MENU_MODE;
  itemWidth?: string;
  rowNum?: number;
};

export default defineComponent({
  name: 'toolbar-item',
  directives: { Clickoutside },
  components: {
    [Tooltip.name]: Tooltip,
    [VMdMenu.name]: VMdMenu,
  },
  props: {
    name: VueTypes.string.isRequired,
    title: String,
    active: Boolean,
    text: String,
    icon: String,
    menus: oneOfType<Array<any> | MenuObject>([Array, Object]),
    disabledMenus: Array,
    preventNativeClick: VueTypes.bool.def(true),
  },
  setup(props, { emit }) {
    const menuActive = ref(false);
    const { name, menus, disabledMenus, preventNativeClick } = toRefs(props);
    const { getToolbarItem } = useToolbar();

    const isMenusObject = 'items' in (menus.value ?? {});

    const toolbarItem = getToolbarItem(name.value);

    const handleToolbarItemClick = () => {
      if (
        toolbarItem.action &&
        !toolbarItem.menus?.length &&
        typeof toolbarItem.action === 'function'
      ) {
        toolbarItem.action();
      }
    };

    const handleToolbarMenuClick = (menu: Menu) => {
      if (menu.action && typeof menu.action === 'function') {
        menu.action();
      }
    };

    const getMenuItems = (menus: Menu[] | undefined) => {
      return (
        menus?.filter(
          ({ name: menuName }: { name: string }) =>
            !disabledMenus.value?.includes(`${name.value}/${menuName}`)
        ) ?? []
      );
    };

    const menuObject = computed(() => {
      return isMenusObject
        ? <MenuObject>menus.value
        : <MenuObject>{
            items: getMenuItems(<Menu[] | undefined>menus.value),
            mode: MENU_MODE.LIST,
          };
    });

    const hasMenu = computed(() => menuObject.value.items.length);

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

    const handleItemClick = (e: MouseEvent) => {
      if (preventNativeClick.value) e.stopPropagation();
      emit('click');
      menuActive.value ? hideMenu() : showMenu();

      if (hasMenu.value) {
        handleHideTooltip();
      } else {
        showTooltip(e);
      }

      handleToolbarItemClick();
    };

    const handleMenuClick = (m: Menu) => {
      handleToolbarMenuClick(m);
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
      const selfEl = toolbarItemEl.value;
      const { target } = e;

      if ((target !== selfEl && target !== menuCtrlEl.value) || menuActive.value) {
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
      hasMenu,
      toolbarItemEl,
      menuCtrlEl,
      tooltipEl,
      tooltipVisible,
      tooltipPosition,
      hideMenu,
      handleItemClick,
      handleMenuClick,
      showTooltip,
      handleHideTooltip,
    };
  },
});
</script>

<style lang="scss">
@import '../../styles/var';

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
