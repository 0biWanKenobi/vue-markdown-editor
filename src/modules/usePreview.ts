import { ref, SetupContext } from 'vue';
import { LINE_MARKUP, HEADING_MARKUP, ANCHOR_MARKUP } from '@/utils/constants/markup';
import { getScrollTop } from '@/utils/scroll-top';
import smoothScroll from '@/utils/smooth-scroll';

const previewEl = ref<any>();
const previewScrollContainer = ref<Function>(() => window);
const previewTop = ref<number>(0);
const html = ref<string>();
const ctx = ref<SetupContext<string[]>>();

const handlePreviewClick = (e: any) => {
  const { target } = e;

  // image preview
  if (target.tagName === 'IMG') {
    const src = target.getAttribute('src');

    if (!src) return;

    const imageEls = Array.from(previewEl.value?.querySelectorAll('img') ?? []);
    const images = imageEls.map((el: any) => el.getAttribute('src')).filter((src) => src);
    const imagePreviewInitIndex = imageEls.indexOf(target);

    ctx.value?.emit('image-click', images, imagePreviewInitIndex);

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

const getOffsetTop = (target: Element, container: Element | Window) => {
  const rect = target.getBoundingClientRect();

  if (container === window || container === document.documentElement) {
    return rect.top;
  }

  return rect.top - (<Element>container).getBoundingClientRect().top;
};

type ScrollToTargetParams = {
  target: Element;
  scrollContainer?: any;
  onScrollEnd?: any;
  top?: number;
};

const scrollToTarget = ({
  target,
  scrollContainer = previewScrollContainer.value(),
  top = previewTop.value,
  onScrollEnd = undefined,
}: ScrollToTargetParams) => {
  const offsetTop = getOffsetTop(target, scrollContainer);
  const scrollTop = getScrollTop(scrollContainer) + offsetTop - top;

  smoothScroll({
    scrollTarget: scrollContainer,
    scrollToTop: scrollTop,
    onScrollEnd,
  });
};

const scrollToLine = ({ lineIndex, onScrollEnd }: { lineIndex: number; onScrollEnd: Function }) => {
  if (lineIndex) {
    const target = previewEl.value?.querySelector(`[${LINE_MARKUP}="${lineIndex}"]`);

    if (target) scrollToTarget({ target, onScrollEnd });
  }
};

export default (_ctx?: SetupContext<string[]>) => {
  ctx.value = _ctx;
  return {
    html,
    previewEl,
    previewTop,
    previewScrollContainer,
    handlePreviewClick,
    scrollToTarget,
    scrollToLine,
    getOffsetTop,
  };
};
