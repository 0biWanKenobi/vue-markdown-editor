import IEditor from '@/interfaces/IEditor';
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
  private get baseEditor() {
    return this.editor as BaseEditor;
  }

  get textArea() {
    return this.editor.type == BaseEditorSymbol ? this.baseEditor.textArea : undefined;
  }

  private _previewScrollbar!: ScrollBar;
  private _genericScrollbar!: ScrollBar;

  constructor() {
    for (const hotKey of Object.values(HotkeyList)) this.hotkeysManager.registerHotkeys(hotKey);
  }

  getScrollbar(type: 'editor' | 'preview' | undefined) {
    switch (type) {
      case 'editor':
        return this.baseEditor.scrollBar;

      case 'preview':
        this._previewScrollbar ??= new ScrollBar('preview');
        return this._previewScrollbar;

      default:
        this._genericScrollbar ??= new ScrollBar();
        return this._genericScrollbar;
  }
}

export default State;
