import PluginParserFn from '@/types/pluginParserFn';
import markdownItTodoList from '@/utils/markdown-it-todo-list';
import type MarkdownIt from 'markdown-it';

const parser: PluginParserFn = (vMdParser, options) => {
  vMdParser.extendMarkdown((mdParser: MarkdownIt) => {
    const color = options?.color || '#3eaf7c';
    const defaultBorderColor = '#d9d9d9';
    const border = (type: string) =>
      `border-color: ${type === 'todo' ? defaultBorderColor : color}`;
    const background = `background-color: ${color}`;

    mdParser.use(markdownItTodoList, {
      renderCheckbox(type: string) {
        const checkboxClass = 'v-md-editor__todo-list-checkbox';
        const style = type === 'todo' ? `${border(type)}` : `${border(type)};${background}`;

        return `<span class="${checkboxClass}${
          type === 'todo' ? '' : ` ${checkboxClass}--checked`
        }" style="${style}"></span>`;
      },
    });
  });
};

export default parser;
