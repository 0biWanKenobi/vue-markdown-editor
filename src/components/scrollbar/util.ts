// Modified from https://github.com/ElemeFE/element/tree/dev/packages/scrollbar

type Dimension = {
  offset: 'offsetWidth' | 'offsetHeight';
  scroll: 'scrollLeft' | 'scrollTop';
  scrollSize: 'scrollWidth' | 'scrollHeight';
  size: 'width' | 'height';
  key: 'horizontal' | 'vertical';
  axis: 'X' | 'Y';
  client: 'clientX' | 'clientY';
  direction: 'left' | 'top';
};

export const BAR_MAP: {
  vertical: Dimension;
  horizontal: Dimension;
} = {
  vertical: {
    offset: 'offsetHeight',
    scroll: 'scrollTop',
    scrollSize: 'scrollHeight',
    size: 'height',
    key: 'vertical',
    axis: 'Y',
    client: 'clientY',
    direction: 'top',
  },
  horizontal: {
    offset: 'offsetWidth',
    scroll: 'scrollLeft',
    scrollSize: 'scrollWidth',
    size: 'width',
    key: 'horizontal',
    axis: 'X',
    client: 'clientX',
    direction: 'left',
  },
};

export function renderThumbStyle({
  move,
  size,
  bar,
}: {
  move: number;
  size: string;
  bar: Dimension;
}) {
  const translate = `translate${bar.axis}(${move}%)`;

  const style = {
    [bar.size]: size,
    transform: translate,
    msTransform: translate,
    webkitTransform: translate,
  };
  return style;
}
