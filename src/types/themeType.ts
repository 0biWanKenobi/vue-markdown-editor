import type MarkdownIt from 'markdown-it';

type Theme = {
  previewClass: string;
  extend: (callback: Function) => void;
  markdownParser: MarkdownIt;
};

export default Theme;
