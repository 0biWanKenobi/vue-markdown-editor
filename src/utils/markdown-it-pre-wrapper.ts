// Modified from https://github.com/vuejs/vuepress/blob/master/packages/%40vuepress/markdown/lib/preWrapper.js
import MarkdownIt from 'markdown-it';
import type { RenderRule } from 'markdown-it/lib/renderer';

export default function (
  md: MarkdownIt,
  options = { getWrapperClass: (lang: string) => `language-${lang}` }
) {
  const { getWrapperClass } = options;

  const wrap = (wrapped: RenderRule) => <RenderRule>((...args) => {
      const [tokens, idx] = args;
      const token = tokens[idx];
      const rawCode = wrapped(...args);

      return (
        `<!--beforebegin--><div class="${getWrapperClass(
          token.info.trim()
        )} extra-class" extra-attr>` +
        `<!--afterbegin-->${rawCode}<!--beforeend--></div><!--afterend-->`
      );
    });

  const { fence, code_block: codeBlock } = md.renderer.rules;
  md.renderer.rules.fence = wrap(fence!);
  md.renderer.rules.code_block = wrap(codeBlock!);
}
