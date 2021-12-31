import { ref } from 'vue';
import { LINE_MARKUP, HEADING_MARKUP, ANCHOR_MARKUP } from '@/utils/constants/markup';
import { getScrollTop } from '@/utils/scroll-top';
import smoothScroll from '@/utils/smooth-scroll';

const previewEl = ref<HTMLElement>();
const previewScrollContainer = ref<Function>(() => window);
const previewTop = ref<number>(0);

const handlePreviewClick = (emit: Function, e: any) => {
  const { target } = e;

  // image preview
  if (target.tagName === 'IMG') {
    const src = target.getAttribute('src');

    if (!src) return;

    const imageEls = Array.from(previewEl.value?.querySelectorAll('img'));
    const images = imageEls.map((el) => el.getAttribute('src')).filter((src) => src);
    const imagePreviewInitIndex = imageEls.indexOf(target);

    emit('image-click', images, imagePreviewInitIndex);

    return;
  }

  const scrollTargetId = target.getAttribute(ANCHOR_MARKUP);
  const scrollTarget = previewEl.value?.querySelector(`[${HEADING_MARKUP}="${scrollTargetId}"]`);

  if (scrollTarget) {
    scrollToTarget({
      target: scrollTarget,
    });
  }
};

const getOffsetTop = (target, container) => {
  const rect = target.getBoundingClientRect();

  if (container === window || container === document.documentElement) {
    return rect.top;
  }

  return rect.top - container.getBoundingClientRect().top;
};

const scrollToTarget = ({
  target,
  scrollContainer = previewScrollContainer.value(),
  top = previewTop.value,
  onScrollEnd = undefined,
}) => {
  const offsetTop = getOffsetTop(target, scrollContainer);
  const scrollTop = getScrollTop(scrollContainer) + offsetTop - top;

  smoothScroll({
    scrollTarget: scrollContainer,
    scrollToTop: scrollTop,
    onScrollEnd,
  });
};

const scrollToLine = ({ lineIndex, onScrollEnd }) => {
  if (lineIndex) {
    const target = previewEl.value?.querySelector(`[${LINE_MARKUP}="${lineIndex}"]`);

    if (target) scrollToTarget({ target, onScrollEnd });
  }
};

export default () => {
  return {
    previewEl,
    previewTop,
    previewScrollContainer,
    handlePreviewClick,
    scrollToTarget,
    scrollToLine,
    getOffsetTop,
  };
};
