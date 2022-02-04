<template>
  <ul class="v-md-editor__toc-nav">
    <li
      :style="{
        paddingLeft: `${indent * item.indent}px`,
      }"
      @click="handleNavClick(item)"
      class="v-md-editor__toc-nav-item"
      v-for="item in titles"
    >
      <span class="v-md-editor__toc-nav-title">{{ item.title }}</span>
    </li>
  </ul>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, ref, toRefs, watch } from 'vue';
import VueTypes from 'vue-types';
import { LINE_MARKUP } from '@/utils/constants/markup';
import TocTitle from '@/types/tocTitleType';
import { tocProps } from '@/modules/toc';
import useVModel from '@/modules/useVModel';
import usePreview from '@/modules/usePreview';
import useScroll from '@/modules/useScroll';

export default defineComponent({
  name: 'toc-nav',
  props: {
    indent: VueTypes.number.def(16),
    ...tocProps,
  },
  emits: ['nav-click'],
  setup(props) {
    const { includeLevel: tocIncludeLevel } = toRefs(props);

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

    const titles = ref<TocTitle[]>([]);

    const anchorsSelector = computed(() =>
      tocIncludeLevel.value?.map((level) => `h${level}`).join(',')
    );

    const updateTocNav = () => {
      const { previewEl } = usePreview();
      if (!previewEl.value) return;

      const anchors: HTMLElement[] = previewEl.value.querySelectorAll(anchorsSelector.value);
      const filteredTitles = Array.from(anchors).filter((title) => !!title.innerText.trim());

      if (!filteredTitles.length) {
        titles.value = [];
        return;
      }

      const hTags = Array.from(new Set(filteredTitles.map((title) => title.tagName))).sort();

      titles.value = filteredTitles.map((el) => ({
        title: el.innerText,
        lineIndex: el.getAttribute(LINE_MARKUP),
        indent: hTags.indexOf(el.tagName),
      }));
    };

    const handleNavClick = ({ lineIndex }: TocTitle) => {
      const { scrollToLine } = useScroll();
      lineIndex && scrollToLine(parseInt(lineIndex.toString()));
    };

    return {
      titles,
      handleNavClick,
    };
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
