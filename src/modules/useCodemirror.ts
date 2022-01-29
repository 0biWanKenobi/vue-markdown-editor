import { ref } from 'vue';
import Hotkeys from '@/utils/hotkeys';

export type CodeMirror = { new (...args: any[]): any };

const Codemirror = ref<CodeMirror>();
const codemirrorInstance = ref();
const hotkeysManager = new Hotkeys();

export default (_Codemirror?: CodeMirror) => {
  if (!Codemirror.value && !!_Codemirror) {
    Codemirror.value = _Codemirror;
  }
  return {
    Codemirror: Codemirror.value,
    codemirrorInstance,
    hotkeysManager,
  };
};
