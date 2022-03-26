import { Ref, ref } from 'vue';
import smoothScroll from '@/utils/smooth-scroll';

class ScrollBar {
  private editorWrapEl = ref();
  private editorResizeEl = ref();
  private previewWrapEl = ref();
  private previewResizeEl = ref();

  wrapEl: Ref<any>;
  resizeEl: Ref<any>;
  getScrollInfo: () => {
    left: any;
    top: any;
    width: any;
    height: any;
    clientWidth: any;
    clientHeight: any;
  };
  scrollTo: (scrollTop: number) => void;

  constructor(scrollbar?: 'editor' | 'preview') {
    switch (scrollbar) {
      case 'editor':
        this.wrapEl = this.editorWrapEl;
        this.resizeEl = this.editorResizeEl;
        this.scrollTo = (scrollTop: number) => this._scrollTo(this.wrapEl.value, scrollTop);
        break;
      case 'preview':
        this.wrapEl = this.previewWrapEl;
        this.resizeEl = this.previewResizeEl;
        break;
      default:
        this.wrapEl = ref();
        this.resizeEl = ref();

        break;
    }
    this.getScrollInfo = () => this._getScrollInfo(this.wrapEl);
    this.scrollTo = (scrollTop: number) => this._scrollTo(this.wrapEl.value, scrollTop);
  }

  _getScrollInfo = (el: Ref<any>) => {
    return {
      left: el.value.scrollLeft,
      top: el.value.scrollTop,
      width: el.value.scrollWidth,
      height: el.value.scrollHeight,
      clientWidth: el.value.clientWidth,
      clientHeight: el.value.clientHeight,
    };
  };

  _scrollTo = (el: any, scrollTop: number) => {
    smoothScroll({
      scrollTarget: el,
      scrollToTop: scrollTop,
    });
  };
}

export default ScrollBar;
