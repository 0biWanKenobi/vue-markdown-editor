/****
 * __          __              _
 * \ \        / /             (_)
 *  \ \  /\  / /_ _ _ __ _ __  _ _ __   __ _
 *   \ \/  \/ / _` | '__| '_ \| | '_ \ / _` |
 *    \  /\  / (_| | |  | | | | | | | | (_| |
 *     \/  \/ \__,_|_|  |_| |_|_|_| |_|\__, |
 *                                      __/ |
 *                                     |___/
 * In order to test the ESModule build, we need to change build/package.json.
 * Specifically, the "module" entry must point to index.esm.mjs instead of index.cjs.
 * This is because vue-cli uses "module" as the entry point in debugging, no matter what.
 *
 */

import App from './App.vue';
import { createApp } from 'vue';

// import '@kangc/v-md-editor/assets/css/bundle.css';
import VueMarkdownEditor from '@kangc/v-md-editor';
import { EditorConfig } from '@kangc/v-md-editor/typings';
import { BaseEditor } from '@kangc/v-md-editor/editor';
import { US } from '@kangc/v-md-editor/lang';
import {
  CreateEmojiPlugin,
  CreateKatexPluginCdn,
  CreateTodoListPlugin,
  CreateLineNumberPlugin,
  CreateCopyCodePlugin,
  CreateHighlightLinesPlugin,
  CreateMermaidPluginCdn,
  CreateCopyCodePreviewPlugin,
} from '@kangc/v-md-editor/plugins';
import { VuepressTheme } from '@kangc/v-md-editor/theme';

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
