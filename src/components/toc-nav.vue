<template>
  <ul class="v-md-editor__toc-nav">
    <li
      :style="{
        paddingLeft: `${indent * item.indent}px`,
      }"
      @click="$emit('nav-click', item)"
      class="v-md-editor__toc-nav-item"
      v-for="item in titles"
    >
      <span class="v-md-editor__toc-nav-title">{{ item.title }}</span>
    </li>
  </ul>
</template>

<script lang="ts">
import { defineComponent, nextTick, watch } from 'vue';
import VueTypes, { array } from 'vue-types';
import TocTitle from '@/types/tocTitleType';
import { tocProps } from '@/modules/toc';
import useToc from '@/modules/useToc';
import useVModel from '@/modules/useVModel';

export default defineComponent({
  name: 'toc-nav',
  props: {
    titles: array<TocTitle>(),
    indent: VueTypes.number.def(16),
    ...tocProps,
  },
  emits: ['nav-click'],
  setup(props) {
    const { updateTocNav } = useToc(props.includeLevel);

    const { text } = useVModel();

    let updateTocNavTimer: NodeJS.Timeout;

    watch(
      () => text.value,
      (_, oldVal) => {
        // render in the first time
        if (typeof oldVal === 'undefined') {
          nextTick(updateTocNav);
          return;
        }

        if (updateTocNavTimer) clearTimeout(updateTocNavTimer);

        updateTocNavTimer = setTimeout(updateTocNav, 800);
      }
    );
  },
});
</script>

<style lang="scss">
@import '../styles/var';

.v-md-editor {
  &__toc-nav {
    margin: 0;
    padding: 0;
    list-style: none;

    &-item {
      position: relative;
      height: 38px;
      overflow: hidden;
      color: $text-color;
      line-height: 38px;
      white-space: nowrap;
      text-overflow: ellipsis;
      cursor: pointer;
    }

    &-item:hover &-title {
      font-size: 17px;
      transform-origin: center center;
    }

    &-title {
      position: relative;
      font-size: 16px;
      transition: 0.3s;
    }
  }
}
</style>
