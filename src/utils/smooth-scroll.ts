import { getScrollTop, scrollTo } from './scroll-top';

type SmoothScrollParams = {
  scrollTarget: Window | HTMLElement;
  scrollToTop: number;
  percent: number;
  onScrollEnd: FrameRequestCallback;
};

type SmoothParams = {
  currentScrollTop: number;
  scrollToTop: number;
  scrollFn: (v: number) => void;
  percent: number;
  onScrollEnd: FrameRequestCallback;
};

export function smooth({
  currentScrollTop,
  scrollToTop,
  scrollFn,
  percent = 10,
  onScrollEnd,
}: SmoothParams) {
  const scrollWay = scrollToTop > currentScrollTop ? 'down' : 'up';
  const step = (scrollToTop - currentScrollTop) * (percent / 100);
  let id: number;

  const scroll = () => {
    currentScrollTop += step;

    if (
      (scrollWay === 'down' && currentScrollTop >= scrollToTop) ||
      (scrollWay === 'up' && currentScrollTop <= scrollToTop)
    ) {
      scrollFn(scrollToTop);

      window.cancelAnimationFrame(id);
      if (onScrollEnd) window.requestAnimationFrame(onScrollEnd);
    } else {
      scrollFn(currentScrollTop);
      window.requestAnimationFrame(scroll);
    }
  };

  window.requestAnimationFrame(scroll);
}

export default function smoothScroll({
  scrollTarget,
  scrollToTop,
  percent = 10,
  onScrollEnd,
}: SmoothScrollParams) {
  const currentScrollTop = getScrollTop(scrollTarget);

  smooth({
    currentScrollTop,
    scrollToTop,
    scrollFn: (scrollTop: number) => scrollTo(scrollTarget, scrollTop),
    percent,
    onScrollEnd,
  });
}
