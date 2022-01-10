import { ref } from 'vue';

export type CodeMirror = { new (...args: any[]): any };

const Codemirror = ref<CodeMirror>();
const codemirrorInstance = ref();

const setValue = (_Codemirror: CodeMirror) => {
  Codemirror.value = _Codemirror;
};

export default () => {
  return {
    Codemirror: Codemirror.value,
    codemirrorInstance,
    setValue,
  };
};
