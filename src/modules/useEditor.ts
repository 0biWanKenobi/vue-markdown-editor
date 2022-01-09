import IEditor from '@/interfaces/IEditor';
import { Ref, ref, SetupContext } from 'vue';
import EDITOR_TYPE, { BASE_EDITOR, CODEMIRROR_EDITOR } from '@/types/editorType';
import BaseEditor from '@/classes/baseEditor';
import CodemirrorEditor from '@/classes/codemirrorEditor';
import { editorEmits } from './common';
import LifecycleStage from '@/types/lifecycleStage';

const DEFAULT_EDITOR = BASE_EDITOR;

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

const setContext = (_ctx: SetupContext<string[]>) => {
  ctx.value = _ctx;
};

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

const useEditor = <T extends IEditor>(editorType: EDITOR_TYPE = DEFAULT_EDITOR) => {
  if (!currentEditor.value) currentEditor.value = editorMap[editorType]();

  return {
    editor: currentEditor.value as T,
    setLifeCycleHooks,
    callLifeCycleHooks,
    installEmits,
    setContext,
    emit,
  };
};

export default useEditor;
