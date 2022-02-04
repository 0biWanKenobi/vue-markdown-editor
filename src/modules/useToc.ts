import { computed, ref } from 'vue';
import useScroll from './useScroll';
import { LINE_MARKUP } from '@/utils/constants/markup';
import type TocTitle from '@/types/tocTitleType';
import usePreview from './usePreview';

const tocVisible = ref(false);
const titles = ref<TocTitle[]>([]);
const tocIncludeLevel = ref<number[]>([2, 3]);

const anchorsSelector = computed(() =>
  tocIncludeLevel.value?.map((level) => `h${level}`).join(',')
);

const toggleToc = (visible = !tocVisible.value) => {
  tocVisible.value = visible;
};

/** used by toc-nav.vue only */
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

const handleNavClick = ({ lineIndex }: { lineIndex: number }) => {
  const { scrollToLine } = useScroll();
  scrollToLine(parseInt(lineIndex.toString()));
};

export default (_tocIncludeLevel?: number[]) => {
  if (_tocIncludeLevel) tocIncludeLevel.value = _tocIncludeLevel;
  return {
    tocVisible,
    titles,
    toggleToc,
    updateTocNav,
    handleNavClick,
  };
};
