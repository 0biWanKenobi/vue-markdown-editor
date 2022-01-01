export function getScrollTop(target: Window | HTMLElement) {
  let result = 0;

  if (target === window) {
    result = target.scrollY;
  } else if (target) {
    result = (<HTMLElement>target).scrollTop;
  }

  return result;
}

export function scrollTo(target: Window | HTMLElement, scrollTop: number) {
  if (target === window) {
    window.scrollTo(window.pageYOffset, scrollTop);
  } else if (target) {
    (<HTMLElement>target).scrollTop = scrollTop;
  }
}
