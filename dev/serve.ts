import App from './App.vue';
import { createApp } from 'vue';
import VueMarkdownEditor from '@/main.esm';
import { EditorConfig } from '@/types';
import { Root } from '@/editor';
// import { GithubTheme } from '@/theme';
import { US } from '@/lang';

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

const app = createApp(App);
app.component(Root.name, Root);

app.use(VueMarkdownEditor, <EditorConfig>{
  langConfig: {
    lang: 'en-US',
    langConfig: US,
  },
});

app.mount('#app');
