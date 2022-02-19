import { computed, ComputedRef, ref } from 'vue';
import { LINE_MARKUP, HEADING_MARKUP, ANCHOR_MARKUP } from '@/utils/constants/markup';
import { getScrollTop } from '@/utils/scroll-top';
import smoothScroll from '@/utils/smooth-scroll';
import ScrollToTargetParams from '@/types/scrollToTargetParams';
import ScrollBar from './scrollBar';

class Preview {
  previewEl = ref<any>();
  previewTop = ref<number>(0);
  html = ref<string>();

  readonly scrollBar = new ScrollBar('preview');
  private readonly isPreviewMode: ComputedRef<boolean>;

  constructor(isPreviewMode: ComputedRef<boolean>) {
    this.isPreviewMode = isPreviewMode;
  }

  previewScrollTo = (scrollTop: number) => {
    const { scrollTo } = this.scrollBar;
    scrollTo(scrollTop);
  };

  handlePreviewClick = (e: any) => {
    const { target } = e;

    // image preview
    if (target.tagName === 'IMG') {
      const src = target.getAttribute('src');

      if (!src) return [];

      const imageEls = Array.from(this.previewEl.value?.querySelectorAll('img') ?? []);
      const images = imageEls.map((el: any) => el.getAttribute('src')).filter((src) => src);
      const imagePreviewInitIndex = imageEls.indexOf(target);

      return [images, imagePreviewInitIndex];
    }

    const scrollTargetId = target.getAttribute(ANCHOR_MARKUP);
    const scrollTarget = this.previewEl.value?.querySelector(
      `[${HEADING_MARKUP}="${scrollTargetId}"]`
    );

    if (scrollTarget) {
      this.scrollToTarget({
        target: scrollTarget,
      });
    }

    return false;
  };

  getOffsetTop = (target: Element, container: Element | Window) => {
    const rect = target.getBoundingClientRect();

    if (container === window || container === document.documentElement) {
      return rect.top;
    }

    return rect.top - (<Element>container).getBoundingClientRect().top;
  };

  propScrollContainer: (() => Element) | undefined = undefined;

  getPreviewScrollContainer = computed(() => {
    const { wrapEl } = this.scrollBar;
    const previewScrollContainer = wrapEl.value;
    const defaultContainer = this.isPreviewMode.value ? window : previewScrollContainer;

    return this.propScrollContainer ? this.propScrollContainer() : defaultContainer;
  });

  scrollToTarget = ({
    target,
    scrollContainer = this.getPreviewScrollContainer.value,
    top = this.previewTop.value,
    onScrollEnd = undefined,
  }: ScrollToTargetParams) => {
    const offsetTop = this.getOffsetTop(target, scrollContainer);
    const scrollTop = getScrollTop(scrollContainer) + offsetTop - top;

    smoothScroll({
      scrollTarget: scrollContainer,
      scrollToTop: scrollTop,
      onScrollEnd,
    });
  };

  scrollToLine = ({ lineIndex, onScrollEnd }: { lineIndex: number; onScrollEnd: Function }) => {
    if (lineIndex) {
      const target = this.previewEl.value?.querySelector(`[${LINE_MARKUP}="${lineIndex}"]`);

      if (target) this.scrollToTarget({ target, onScrollEnd });
    }
  };
}

export default Preview;
