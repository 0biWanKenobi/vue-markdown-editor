import App from './App.vue';
import { createApp } from 'vue';
import VueMarkdownEditor, { BaseEditor, EditorConfig, PreviewHtml, Languages } from '../src/main';

import createEmojiPlugin from '../src/plugins/emoji/full';
import '../src/plugins/emoji/emoji';
import createKatexPlugin from '../src/plugins/katex/cdn';
import createTodoListPlugin from '../src/plugins/todo-list/index';
import '../src/plugins/todo-list/todo-list';
import createLineNumberPlugin from '../src/plugins/line-number/index';
import createCopyCodePlugin from '../src/plugins/copy-code/index';
import '../src/plugins/copy-code/copy-code';
import createHighLinesPlugin from '../src/plugins/highlight-lines/';
import '../src/plugins/highlight-lines/highlight-lines';
import createMermaidPlugin from '../src/plugins/mermaid/cdn';

import createCreateCopyCodePreview from '../src/plugins/copy-code/preview';

// import vuepressTheme from '../src/theme/vuepress';

import Prism from 'prismjs';

// codemirror 编辑器的相关资源
//import Codemirror from 'codemirror';
// mode
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/vue/vue';
// edit
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchbrackets';
// placeholder
import 'codemirror/addon/display/placeholder';
// active-line
import 'codemirror/addon/selection/active-line';
// scrollbar
import 'codemirror/addon/scroll/simplescrollbars';
import 'codemirror/addon/scroll/simplescrollbars.css';
// style
import 'codemirror/lib/codemirror.css';
import CodeMirror from 'codemirror';

const app = createApp(App);

app.use(VueMarkdownEditor, <EditorConfig>{
  editor: {
    instance: BaseEditor,
    type: 'base',
  },
  langConfig: {
    lang: 'en-US',
    langConfig: Languages.US,
  },
  preview: PreviewHtml,
  Codemirror: CodeMirror,
  themeConfig: {
    config: {
      Prism,
      codeHighlightExtensionMap: {
        vue: 'markup',
      },
    },
    theme: 'vuepress',
  },
  plugins: [
    { plugin: createCreateCopyCodePreview() },
    { plugin: createEmojiPlugin() },
    { plugin: createKatexPlugin() },
    { plugin: createTodoListPlugin() },
    { plugin: createLineNumberPlugin() },
    { plugin: createCopyCodePlugin() },
    { plugin: createHighLinesPlugin() },
    { plugin: createMermaidPlugin() },
  ],
});

app.mount('#app');
