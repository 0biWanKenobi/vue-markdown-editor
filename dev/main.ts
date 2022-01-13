import App from './App.vue';
import { createApp } from 'vue';
import VueMarkdownEditor, { BaseEditor, EditorConfig, PreviewHtml, Languages } from '../src/main';
import { VuepressTheme } from '../src/theme';

import {
  CreateEmojiPlugin,
  CreateKatexPluginCdn,
  CreateTodoListPlugin,
  CreateLineNumberPlugin,
  CreateCopyCodePlugin,
  CreateHighlightLinesPlugin,
  CreateMermaidPluginCdn,
  CreateCopyCodePreviewPlugin,
} from '../src/plugins';

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
    theme: VuepressTheme,
  },
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
