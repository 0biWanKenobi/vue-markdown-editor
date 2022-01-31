import { ref, SetupContext, provide } from 'vue';
import IEditor from '@/interfaces/IEditor';
import EDITOR_TYPE, { BASE_EDITOR, CODEMIRROR_EDITOR } from '@/types/editorType';
import BaseEditor from '@/classes/baseEditor';
import CodemirrorEditor from '@/classes/codemirrorEditor';
import { editorEmits } from './common';
import LifecycleStage from '@/types/lifecycleStage';

const editorMap: Record<string, () => IEditor> = {
  [BASE_EDITOR]: () => new BaseEditor(),
  [CODEMIRROR_EDITOR]: () => new CodemirrorEditor(),
};

const lifeCycleHooks: Record<string, Function[]> = {
  [LifecycleStage.mounted]: [],
  [LifecycleStage.unmounted]: [],
  [LifecycleStage.beforeMount]: [],
  [LifecycleStage.beforeUnmount]: [],
};

const currentEditor = ref<IEditor>();

const ctx = ref<SetupContext<string[]>>();

const setLifeCycleHooks = (stage: LifecycleStage, ...hooks: Function[]) => {
  lifeCycleHooks[stage].push(...hooks);
};

const callLifeCycleHooks = (stage: LifecycleStage) => {
  for (const hook of lifeCycleHooks[stage]) {
    hook();
  }
};

const installEmits = (...ee: string[]) => {
  editorEmits.push(...ee);
};

const emit = (e: string, ...args: any[]) => {
  ctx.value?.emit(e, args);
};

export const provideEditor = <T extends IEditor>(editor: T) => {
  provide<T>('Editor', editor);
};

const useEditor = <T extends IEditor>(editorType?: EDITOR_TYPE, _ctx?: SetupContext<any>) => {
  if (!currentEditor.value && editorType) currentEditor.value = editorMap[editorType]();
  if (_ctx && !ctx.value) ctx.value = _ctx;

  return {
    editor: currentEditor.value as T,
    setLifeCycleHooks,
    callLifeCycleHooks,
    installEmits,
    emit,
  };
};

export default useEditor;
