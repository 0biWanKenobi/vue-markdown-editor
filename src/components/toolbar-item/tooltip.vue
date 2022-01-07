<template>
  <transition name="v-md-fade-in">
    <div
      v-show="visible"
      :style="{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }"
      class="v-md-editor__tooltip"
      ref="tooltip"
    >
      {{ text }}
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref, toRefs, watch } from 'vue';
import VueTypes, { object } from 'vue-types';

type Position = {
  x: number;
  y: number;
};

export default defineComponent({
  name: 'v-md-tooltip',
  props: {
    text: String,
    visible: VueTypes.bool.def(false),
    position: object<Position>().def({
      x: 0,
      y: 0,
    }),
  },
  setup(props) {
    const { position, visible } = toRefs(props);

    watch(
      () => visible.value,
      (isVisible) => {
        if (!isVisible) return;
        nextTick(calculateLayout);
      }
    );

    const tooltip = ref();

    const calculateLayout = () => {
      // 容器右边框距离可视区域左侧的距离
      const { right } = tooltip.value.$el.getBoundingClientRect();
      const windowWidth = document.documentElement.clientWidth;

      if (windowWidth - right < 0) {
        position.value.x -= right - windowWidth;
      }
    };

    return {
      tooltip,
    };
  },
});
</script>

<style lang="scss">
@import '@/styles/var';

.v-md-editor {
  &__tooltip {
    position: absolute;
    z-index: $tooltip-z-index;
    padding: $tooltip-padding;
    color: $tooltip-color;
    font-size: $tooltip-font-size;
    line-height: 1;
    white-space: nowrap;
    background-color: $tooltip-background;
    border-radius: $tooltip-border-radius;
    box-shadow: $box-shadow-light;
  }
}
</style>
