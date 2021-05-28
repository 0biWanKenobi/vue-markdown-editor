# Github

## Introduction

example：

<ClientOnly>
  <base-editor />
</ClientOnly>

## Expand

The theme package only supports js(javascript), xml(html), css by default. In order to avoid introducing too much redundant code, the package size is too large. If you need to support more language code highlighting, please introduce the corresponding language pack as needed.

```js
import VueMarkdownEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';

// highlightjs
import hljs from 'highlight.js';

VueMarkdownEditor.use(githubTheme, {
  Hljs: hljs,
  extend(md) {
    // md is a markdown-it instance, you can modify the configuration here, and use plugin for syntax expansion
    // md.set(option).use(plugin);
  },
});
```

[Check out the language packs supported by highlight.js](https://github.com/highlightjs/highlight.js/tree/master/src/languages)

After expansion, the corresponding code block can be highlighted.

<ClientOnly>
  <extend-github-theme />
</ClientOnly>
