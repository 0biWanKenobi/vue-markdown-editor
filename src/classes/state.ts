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
  constructor() {
    for (const hotKey of Object.values(HotkeyList)) this.hotkeysManager.registerHotkeys(hotKey);
  }
  }
}

export default State;
