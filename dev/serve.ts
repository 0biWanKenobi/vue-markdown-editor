import App from './App.vue';
import { createApp } from 'vue';
import VueMarkdownEditor from '@/main.esm';
import { EditorConfig } from '@/types';
import { Root } from '@/editor';
import { VuepressTheme } from '@/theme';
// import { GithubTheme } from '@/theme';
import { US } from '@/lang';

import {
  CreateEmojiPlugin,
  CreateKatexPluginCdn,
  CreateTodoListPlugin,
  CreateLineNumberPlugin,
  CreateCopyCodePlugin,
  CreateHighlightLinesPlugin,
  CreateMermaidPluginCdn,
  CreateCopyCodePreviewPlugin,
} from '@/plugins';

import Prism from 'prismjs';

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
app.component(Root.name, Root);

app.use(VueMarkdownEditor, <EditorConfig>{
  editor: {
    type: 'codemirror',
  },
  langConfig: {
    lang: 'en-US',
    langConfig: US,
  },
  Codemirror: CodeMirror,
  themeConfig: {
    config: {
      Prism,
      codeHighlightExtensionMap: {
        vue: 'markup',
      },
    },
    theme: VuepressTheme,
  },
  // themeConfig: {
  //   config: {
  //     Hljs,
  //     codeHighlightExtensionMap: {
  //       vue: 'xml',
  //     },
  //   },
  //   theme: GithubTheme,
  // },
  plugins: [
    { plugin: CreateCopyCodePreviewPlugin() },
    { plugin: CreateEmojiPlugin() },
    { plugin: CreateKatexPluginCdn() },
    { plugin: CreateTodoListPlugin() },
    { plugin: CreateLineNumberPlugin() },
    { plugin: CreateCopyCodePlugin() },
    { plugin: CreateHighlightLinesPlugin() },
    { plugin: CreateMermaidPluginCdn() },
  ],
});

app.mount('#app');
