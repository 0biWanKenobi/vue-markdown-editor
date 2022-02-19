import IEditor from '@/interfaces/IEditor';
import Preview from './preview';
import { InjectionKey, nextTick, Ref } from 'vue';
import type BaseEditor from './baseEditor';
import { BaseEditorSymbol } from './baseEditor';
import FullScreen from './fullScreen';
import ScrollBar from './scrollBar';
import Hotkeys from '@/utils/hotkeys';
import * as HotkeyList from '@/hotkeys';

export const StateSymbol: InjectionKey<Ref<State>> = Symbol('State');

class State {
  editor!: IEditor;
  fullScreen = new FullScreen();
  hotkeysManager = new Hotkeys();

  readonly preview: Preview;

  private get baseEditor() {
    return this.editor as BaseEditor;
  }

  get textArea() {
    return this.editor.type == BaseEditorSymbol ? this.baseEditor.textArea : undefined;
  }

  private _genericScrollbar!: ScrollBar;

  constructor() {
    for (const hotKey of Object.values(HotkeyList)) this.hotkeysManager.registerHotkeys(hotKey);
    this.preview = new Preview();
  }

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
