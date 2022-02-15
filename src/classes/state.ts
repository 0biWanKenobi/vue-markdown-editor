import IEditor from '@/interfaces/IEditor';
import { InjectionKey, Ref } from 'vue';
import { BaseEditorSymbol } from './baseEditor';
import FullScreen from './fullScreen';
import TextArea from './textArea';

export const StateSymbol: InjectionKey<Ref<State>> = Symbol('State');

class State {
  fullScreen = new FullScreen();
  editor!: IEditor;
  get textArea() {
    return this.editor.type == BaseEditorSymbol ? (this.editor.textArea as TextArea) : undefined;
  }
}

export default State;
