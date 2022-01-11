import { ref } from 'vue';
import Hotkeys from '@/utils/hotkeys';

export type CodeMirror = { new (...args: any[]): any };

const Codemirror = ref<CodeMirror>();
const codemirrorInstance = ref();
const hotkeysManager = new Hotkeys();

const setValue = (_Codemirror: CodeMirror) => {
  Codemirror.value = _Codemirror;
};

export default () => {
  return {
    Codemirror: Codemirror.value,
    codemirrorInstance,
    hotkeysManager,
    setValue,
  };
};
