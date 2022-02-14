import IEditor from '@/interfaces/IEditor';
import { InjectionKey, Ref } from 'vue';
import FullScreen from './fullScreen';
import TextArea from './textArea';

export const StateSymbol: InjectionKey<Ref<State>> = Symbol('State');

class State {
  fullScreen = new FullScreen();
  textArea = new TextArea();
  editor!: IEditor;
}

export default State;
