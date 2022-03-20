import IEditor from '@/interfaces/IEditor';
import Preview from './preview';
import { computed, InjectionKey, nextTick, ref, Ref } from 'vue';
import type BaseEditor from './baseEditor';
import { BaseEditorSymbol } from './baseEditor';
import FullScreen from './fullScreen';
import ScrollBar from './scrollBar';
import Hotkeys from '@/utils/hotkeys';
import * as HotkeyList from '@/hotkeys';
import EDITOR_MODE from '@/utils/constants/editor-mode';
import Option from '@/types/OptionType';
import Install from '@/types/installType';
import PluginCreatorParams from '@/types/pluginCreationFnParams';
import { VMdParser } from '@/utils/v-md-parser';

export const StateSymbol: InjectionKey<Ref<State>> = Symbol('State');

class State {
  text = ref<string | undefined>('');
  readonly parser: VMdParser;

  currentMode = ref(EDITOR_MODE.EDITABLE);
  isPreviewMode = computed(() => this.currentMode.value === EDITOR_MODE.PREVIEW);
  isEditMode = computed(() => this.currentMode.value === EDITOR_MODE.EDIT);
  isEditableMode = computed(() => this.currentMode.value === EDITOR_MODE.EDITABLE);
  fullScreen = new FullScreen();
  hotkeysManager = new Hotkeys();

  readonly preview: Preview;
  private _editor!: IEditor;

  get editor() {
    return this._editor;
  }

  set editor(e: IEditor) {
    this._editor = e;
    watch(
      () => this.text.value,
      (v) => (this._editor.text.value = v),
      {
        immediate: true,
      }
    );
  }

  private get baseEditor() {
    return this.editor as BaseEditor;
  }

  get textArea() {
    return this.editor.type == BaseEditorSymbol ? this.baseEditor.textArea : undefined;
  }

  private _genericScrollbar!: ScrollBar;

  constructor() {
    for (const hotKey of Object.values(HotkeyList)) this.hotkeysManager.registerHotkeys(hotKey);
    this.preview = new Preview(this.isPreviewMode);
    this.parser = new VMdParser();
  }

  use(optionsOrInstall: Option | Install, opt?: any) {
    if (typeof optionsOrInstall === 'function') {
      optionsOrInstall(this, opt);
    } else {
      (<Install>optionsOrInstall).install(this, opt);
    }
    return this;
  }

  installPlugins = (
    plugins: Array<{
      plugin: Install;
      params?: PluginCreatorParams;
    }>
  ) => {
    for (const pluginConfig of plugins) {
      this.use(pluginConfig.plugin, pluginConfig.params);
    }
  };

  getScrollbar(type: 'editor' | 'preview' | undefined) {
    switch (type) {
      case 'editor':
        return this.baseEditor.scrollBar;

      case 'preview':
        return this.preview.scrollBar;

      default:
        this._genericScrollbar ??= new ScrollBar();
        return this._genericScrollbar;
    }
  }

  insert = (getInsertContent: (v: string | undefined) => { text: string; selected?: string }) => {
    const { getCurrentSelectedStr, replaceSelectionText, changeSelectionTo, focus } = this.editor;

    focus();

    const currentSelectedStr = getCurrentSelectedStr();
    const { selected, text } = getInsertContent(currentSelectedStr);

    replaceSelectionText(text);

    nextTick().then(() => {
      changeSelectionTo(text, selected);
    });
  };

  setFocusEnd = () => {
    this.editor.editorFocusEnd();
    this.editor.editorScrollToTop(9999);
    this.preview.previewScrollTo(9999);
  };
}

export default State;
