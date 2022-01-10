import { ref } from 'vue';
import smoothScroll from '@/utils/smooth-scroll';

const editorWrapEl = ref();
const editorResizeEl = ref();

const previewWrapEl = ref();
const previewResizeEl = ref();

const getScrollInfo = (scrollbar: 'editor' | 'preview') => {
  const el = scrollbar == 'editor' ? editorWrapEl.value : previewWrapEl.value;
  return _getScrollInfo(el);
};

const _getScrollInfo = (el: any) => {
  return {
    left: el.scrollLeft,
    top: el.scrollTop,
    width: el.scrollWidth,
    height: el.scrollHeight,
    clientWidth: el.clientWidth,
    clientHeight: el.clientHeight,
  };
};

const scrollTo = (scrollTop: number, scrollbar: 'editor' | 'preview') => {
  const el = scrollbar == 'editor' ? editorWrapEl.value : previewWrapEl.value;
  _scrollTo(el, scrollTop);
};

const _scrollTo = (el: any, scrollTop: number) => {
  smoothScroll({
    scrollTarget: el,
    scrollToTop: scrollTop,
  });
};

export default (scrollbar?: 'editor' | 'preview') => {
  switch (scrollbar) {
    case 'editor':
      return {
        wrapEl: editorWrapEl,
        resizeEl: editorResizeEl,
        getScrollInfo: () => getScrollInfo('editor'),
        scrollTo: (scrollTop: number) => scrollTo(scrollTop, 'editor'),
      };
    case 'preview':
      return {
        wrapEl: previewWrapEl,
        resizeEl: previewResizeEl,
        getScrollInfo: () => getScrollInfo('preview'),
        scrollTo: (scrollTop: number) => scrollTo(scrollTop, 'preview'),
      };
    default:
      const _wrapEl = ref();
      const _resizeEl = ref();
      return {
        wrapEl: ref(),
        resizeEl: ref(),
        getScrollInfo: () => _getScrollInfo(_wrapEl),
        scrollTo: (scrollTop: number) => _scrollTo(_resizeEl, scrollTop),
      };
  }
};
