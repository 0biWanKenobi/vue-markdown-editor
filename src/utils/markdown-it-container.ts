// Modified from https://github.com/vuepress/vuepress-community/blob/master/packages/vuepress-plugin-container/src/markdown-it-container.ts

import container from 'markdown-it-container';
import MarkdownIt from 'markdown-it';

function wrapRenderPlaceFunction(func: any) {
  if (typeof func === 'string') {
    return () => func;
  }
  return func;
}

export default function (
  md: MarkdownIt,
  {
    validate,
    marker,
    render,
    type,
    before,
    after,
    defaultTitle = type.toUpperCase(),
    blockClass = 'custom-block',
  }: any
) {
  if (!type) {
    return;
  }

  if (!render) {
    let renderBefore: (info: string) => string;
    let renderAfter: (info?: string) => string;

    if (before !== undefined && after !== undefined) {
      // user defined
      renderBefore = wrapRenderPlaceFunction(before);
      renderAfter = wrapRenderPlaceFunction(after);
    } else {
      // fallback default
      renderBefore = (info: string) =>
        `<div class="${blockClass} ${type}">${
          info ? `<p class="${blockClass}-title">${info}</p>` : ''
        }\n`;
      renderAfter = () => '</div>\n';
    }

    render = (tokens: any[], index: any) => {
      const token = tokens[index];

      let info = token.info.trim().slice(type.length).trim();

      if (!info && defaultTitle) {
        if (typeof defaultTitle === 'function') {
          info = defaultTitle();
        } else {
          info = defaultTitle;
        }
      }

      if (token.nesting === 1) {
        return renderBefore(info);
      }

      return renderAfter(info);
    };
  }

  md.use(container, type, { render, validate, marker });
}
