import { computed, nextTick, ref, watch } from 'vue';
import useScroll from './useScroll';
import { LINE_MARKUP } from '@/utils/constants/markup';
import useVModel from '@/modules/useVModel';
import type TocTitle from '@/types/tocTitleType';

const tocVisible = ref(false);
const titles = ref<TocTitle[]>([]);
const tocIncludeLevel = ref<string[]>();

const { text } = useVModel();

let updateTocNavTimer: NodeJS.Timeout;

watch(
  () => text,
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

const previewEl = ref();

const anchorsSelector = computed(() =>
  tocIncludeLevel.value?.map((level) => `h${level}`).join(',')
);

const toggleToc = (visible = !tocVisible.value) => {
  tocVisible.value = visible;
};

const updateTocNav = () => {
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

const { scrollToLine } = useScroll();

const handleNavClick = ({ lineIndex }: { lineIndex: number }) => {
  scrollToLine(lineIndex);
};

export default () => {
  return {
    tocVisible,
    titles,
    toggleToc,
    updateTocNav,
    handleNavClick,
  };
};
