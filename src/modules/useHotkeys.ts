import LifecycleStage from '@/types/lifecycleStage';
import * as Hotkeys from '../hotkeys';
import useEditor from './useEditor';
import { HotKey } from '@/types/hotKeyType';
import { ref } from 'vue';
import useEditorMode from './useEditorMode';

const hotkeys: HotKey[] = [];

const onMounted = () => {
  const { isPreviewMode } = useEditorMode();
  if (isPreviewMode.value) return;

  const {
    editor: { editorRegisterHotkeys },
  } = useEditor();

  for (const hotKey of Object.values(Hotkeys)) editorRegisterHotkeys(hotKey);
  for (const hotKey of hotkeys) {
    editorRegisterHotkeys(hotKey);
  }
};

const registerHotkeys = (hotkey: HotKey) => {
  hotkeys.push(hotkey);
};

const areHooksSaved = ref(false);

export default () => {
  if (!areHooksSaved.value) {
    areHooksSaved.value = true;
    const { setLifeCycleHooks } = useEditor();
    setLifeCycleHooks(LifecycleStage.mounted, onMounted);
  }

  return {
    registerHotkeys,
  };
};
