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
import TocTitle from '@/types/tocTitleType';
import { tocProps } from '@/modules/toc';
import useToc from '@/modules/useToc';
import { defineComponent } from 'vue';
import VueTypes, { array } from 'vue-types';

export default defineComponent({
  name: 'toc-nav',
  props: {
    titles: array<TocTitle>(),
    indent: VueTypes.number.def(16),
    ...tocProps,
  },
  emits: ['nav-click'],
  setup(props) {
    useToc(props.includeLevel);
  },
});
</script>

<style lang="scss">
@import 'styles/var';

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
