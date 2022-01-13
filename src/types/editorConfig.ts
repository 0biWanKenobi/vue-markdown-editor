import ThemeConfig from './themeConfigType';

import { DefineComponent } from 'vue';
import PluginCreatorParams from './pluginCreationFnParams';
import LangClassConfig from './langClassConfig';
import { Install } from '@/interfaces/IEditor';
import ThemeInstallFn from './themeInstallFnType';

export type ThemeConfigOption = {
  theme: {
    install: ThemeInstallFn;
  };
  config: Partial<ThemeConfig>;
};

/**
 * @property editor: Either `BaseEditor` or `CodeMirrorEditor`.
 *
 * You should `import {BaseEditor} from '@kangc/v-md-editor`, or `import {CodeMirrorEditor} from '@kangc/v-md-editor`
 *
 * @property preview:  Either `Preview` or `HtmlPreview`.
 *
 * You should `import {Preview} from '@kangc/v-md-editor`, or `import {HtmlPreview} from '@kangc/v-md-editor`
 *
 * @property Codemirror: * `CodeMirror` instance.
 *
 * You should `import CodeMirror from 'codemirror`.
 *
 * @property themeConfig: theme Configuration
 */
type EditorConfig = {
  langConfig?: LangClassConfig;
  /**
   * @property editor: Either `BaseEditor` or `CodeMirrorEditor`.
   *
   * You should `import {BaseEditor} from '@kangc/v-md-editor`, or `import {CodeMirrorEditor} from '@kangc/v-md-editor`
   **/
  editor: {
    instance: DefineComponent<{}, {}, any>;
    type: 'base' | 'codemirror';
  };
  /**
   * @property preview:  Either `Preview` or `HtmlPreview`.
   *
   * You should `import {Preview} from '@kangc/v-md-editor`, or `import {HtmlPreview} from '@kangc/v-md-editor`
   */
  preview: DefineComponent<{}, {}, any>;

  plugins?: Array<{
    plugin: Install;
    params?: PluginCreatorParams;
  }>;
  /**
   * @property Codemirror: * `CodeMirror` instance.
   *
   * You should `import CodeMirror from 'codemirror'`.
   *
   * @property themeConfig: theme Configuration
   */
  Codemirror?: any;
  /**
   * @property themeConfig: theme Configuration
   */
  themeConfig?: ThemeConfigOption;
};

export default EditorConfig;
