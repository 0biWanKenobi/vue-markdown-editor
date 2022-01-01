import type * as MarkdownIt from 'markdown-it';
import { RenderRule } from 'markdown-it/lib/renderer';

export default function (md: MarkdownIt, { lineMarkup = 'data-line' } = {}) {
  const defaultRender: RenderRule = function (tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options);
  };

  function addAttrwrapper(originalRender: RenderRule) {
    const renderRule: RenderRule = (tokens, idx, options, env, self) => {
      const token = tokens[idx];
      const lineNumber = token.map![0] + 1;
      token.attrPush([lineMarkup, lineNumber.toString()]);

      return originalRender(tokens, idx, options, env, self);
    };

    return renderRule;
  }

  function modifyCodewrapper(originalRender: RenderRule) {
    const renderRule: RenderRule = (tokens, idx, options, env, self) => {
      const rawCode = originalRender(tokens, idx, options, env, self);
      const token = tokens[idx];
      const lineNumber = token.map![0] + 1;

      return `<div ${lineMarkup}="${lineNumber}">${rawCode}</div>`;
    };

    return renderRule;
  }

  const wrapperMap: Record<string, (v: RenderRule) => RenderRule> = {
    table_open: addAttrwrapper,
    blockquote_open: addAttrwrapper,
    bullet_list_open: addAttrwrapper,
    ordered_list_open: addAttrwrapper,
    reference_open: addAttrwrapper,
    heading_open: addAttrwrapper,
    lheading_open: addAttrwrapper,
    paragraph_open: addAttrwrapper,
    hr: addAttrwrapper,
    html_block: modifyCodewrapper,
    code_block: modifyCodewrapper,
    fence: modifyCodewrapper,
  };

  type RuleName = keyof typeof wrapperMap;

  Object.keys(wrapperMap).forEach((ruleName) => {
    const originalRender = md.renderer.rules[ruleName];
    const render = originalRender || defaultRender;

    md.renderer.rules[ruleName] = wrapperMap[ruleName as RuleName](render);
  });
}
