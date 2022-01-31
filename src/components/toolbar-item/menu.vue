<template>
  <transition name="v-md-zoom-in-top">
    <ul
      class="v-md-editor__menu"
      :class="[`v-md-editor__menu--${mode}`]"
      :style="style"
      v-show="visible"
      @mousemove.stop
      @click.stop
      ref="menuEl"
    >
      <template v-if="isListMode">
        <li
          v-for="item in menus"
          :key="item.name"
          class="v-md-editor__menu-item"
          :class="[`v-md-editor__menu-item-${item.name}`, item.class]"
          @click.stop="handleClick(item)"
        >
          <v-md-render :render-fn="item.render" v-if="item.render" />
          <template v-else>
            {{ getText(item.text) }}
          </template>
        </li>
      </template>
      <template v-else>
        <li>
          <div v-for="rowIndex in rowCount" class="v-md-editor__menu-row">
            <span
              v-for="item in getRowMenus(rowIndex)"
              :key="item.name"
              :style="{
                width: itemWidth,
              }"
              class="v-md-editor__menu-item"
              :class="[`v-md-editor__menu-item-${item.name}`, item.class]"
              @click.stop="handleClick(item)"
              >{{ item.text }}</span
            >
          </div>
        </li>
      </template>
    </ul>
  </transition>
</template>

<script lang="ts">
import VMdRender from '@/components/render.vue';
import Menu from '@/types/toolbarItemMenu';
import MENU_MODE from '@/utils/constants/menu-mode';
import { computed, defineComponent, nextTick, ref, toRefs, watch } from 'vue';
import VueTypes, { array } from 'vue-types';

export default defineComponent({
  name: 'v-md-menu',
  components: {
    VMdRender,
  },
  props: {
    mode: VueTypes.string.def(MENU_MODE.PANEL),
    menus: array<Menu>().isRequired,
    itemWidth: VueTypes.string.def('30px'),
    rowNum: VueTypes.number.def(10),
    visible: Boolean,
  },
  emits: ['update:visible', 'item-click'],
  setup(props, { emit }) {
    const style = ref<{
      left?: number;
      right?: number;
    }>({
      left: 0,
    });

    const { mode, menus, rowNum, visible } = toRefs(props);

    const rowCount = computed(() => Math.ceil(menus.value.length / rowNum.value));
    const isListMode = computed(() => mode.value === MENU_MODE.LIST);

    const menuEl = ref();

    const calculateLayout = () => {
      // 容器右边框距离可视区域左侧的距离
      const { right } = menuEl.value.getBoundingClientRect();
      const windowWidth = document.documentElement.clientWidth;

      if (windowWidth - right < 0) style.value = { right: 0 };
    };

    const getRowMenus = (rowIndex: number) => {
      const end = rowIndex * rowNum.value;
      const start = end - rowNum.value;

      return menus.value.slice(start, end);
    };

    const getText = (text: string | (() => string)) => {
      if (typeof text === 'function') {
        return text();
      }

      return text;
    };

    const hide = () => {
      emit('update:visible', false);
    };

    const handleClick = (item: Menu) => {
      emit('item-click', item);

      hide();
    };

    watch(
      () => visible.value,
      (v) => {
        if (v) nextTick(calculateLayout);
      }
    );

    return {
      style,
      rowCount,
      isListMode,
      menuEl,
      handleClick,
      getText,
      getRowMenus,
    };
  },
});
</script>

<style lang="scss">
@import '../../styles/var';
@import '../../styles/mixins';

.v-md-editor {
  &__menu {
    position: absolute;
    top: 38px;
    z-index: 99;
    list-style: none;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: $box-shadow-light;
    transform-origin: center top;

    @include scrollbar-style;

    &-item {
      color: $toolbar-text-color;
      font-weight: normal;
      font-size: $menu-font-size;
      white-space: nowrap;
      list-style: none;

      &:hover {
        background-color: $toolbar-hover-background;
      }
    }

    &--list {
      padding: 5px 0;

      .v-md-editor__menu-item {
        padding: 0 24px;
        line-height: 34px;
        text-align: left;
      }
    }

    &--panel {
      max-height: 200px;
      padding: 12px 10px;
      overflow-y: auto;

      .v-md-editor__menu-row {
        display: flex;
        flex-wrap: nowrap;

        &:not(:last-child) {
          margin-bottom: 6px;
        }
      }

      .v-md-editor__menu-item {
        display: inline-block;
        padding: 8px 0;
        line-height: 1;
        text-align: center;
        border-radius: 2px;

        &:not(:last-child) {
          margin-right: 4px;
        }
      }
    }
  }
}
</style>
