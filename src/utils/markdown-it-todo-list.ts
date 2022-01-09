// Modified from https://github.com/revin/markdown-it-task-lists/blob/master/index.js

import MarkdownIt from 'markdown-it';
import Token from 'markdown-it/lib/token';

const defaults = {
  listClass: 'v-md-editor__todo-list',
  listItemClass: 'v-md-editor__todo-list-item',
  renderCheckbox: (type: string) =>
    `<input class="v-md-editor__todo-list-checkbox" type="checkbox" ${
      type === 'todo' ? '' : 'checked'
    }>`,
};

type Options = typeof defaults;

/* eslint-disable */
export default function (md: MarkdownIt, options: Options = defaults) {
  const { listClass, listItemClass, renderCheckbox } = options;

  function attrSet(token: Token, name: string, value: string) {
    const index = token.attrIndex(name);
    const attr = [name, value];

    if (index < 0) {
      token.attrPush([name, value]);
    } else {
      token.attrs && (token.attrs[index] = [name, value]);
    }
  }

  function parentToken(tokens: Token[], index: number) {
    const targetLevel = tokens[index].level - 1;
    for (let i = index - 1; i >= 0; i--) {
      if (tokens[i].level === targetLevel) {
        return i;
      }
    }
    return -1;
  }

  function isTodoItem(tokens: Token[], index: number) {
    return (
      isInline(tokens[index]) &&
      isParagraph(tokens[index - 1]) &&
      isListItem(tokens[index - 2]) &&
      startsWithTodoMarkdown(tokens[index])
    );
  }

  function todoify(token: Token) {
    token.children?.unshift(makeCheckbox(token));
    token.children &&
      token.children[1] &&
      (token.children[1].content = token.children[1].content.slice(3));
    token.content = token.content.slice(3);
  }

  function makeCheckbox(token: Token) {
    const checkbox = new Token('html_inline', '', 0);

    if (token.content.indexOf('[ ] ') === 0) {
      checkbox.content = renderCheckbox('todo');
    } else if (token.content.indexOf('[x] ') === 0 || token.content.indexOf('[X] ') === 0) {
      checkbox.content = renderCheckbox('completed');
    }

    return checkbox;
  }

  function isInline(token: Token) {
    return token.type === 'inline';
  }
  function isParagraph(token: Token) {
    return token.type === 'paragraph_open';
  }
  function isListItem(token: Token) {
    return token.type === 'list_item_open';
  }

  function startsWithTodoMarkdown(token: Token) {
    // leading whitespace in a list item is already trimmed off by markdown-it
    return (
      token.content.indexOf('[ ] ') === 0 ||
      token.content.indexOf('[x] ') === 0 ||
      token.content.indexOf('[X] ') === 0
    );
  }

  md.core.ruler.after('inline', 'v-md-task-lists', (state) => {
    const { tokens } = state;
    for (let i = 2; i < tokens.length; i++) {
      if (isTodoItem(tokens, i)) {
        todoify(tokens[i]);
        attrSet(tokens[i - 2], 'class', listItemClass);
        attrSet(tokens[parentToken(tokens, i - 2)], 'class', listClass);
      }
    }
  });
}
