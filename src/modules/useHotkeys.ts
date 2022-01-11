import LifecycleStage from '@/types/lifecycleStage';
import * as Hotkeys from '../hotkeys';
import useCommon from './useCommon';
import useEditor from './useEditor';
import { HotKey } from '@/types/hotKeyType';
import { ref } from 'vue';

const hotkeys: HotKey[] = [];

const onMounted = () => {
  const { isPreviewMode } = useCommon();
  if (isPreviewMode.value) return;

  const {
    editor: { editorRegisterHotkeys },
  } = useEditor();

  for (let hotKey of Object.values(Hotkeys)) editorRegisterHotkeys(hotKey);
  for (const hotKey of hotkeys) {
    editorRegisterHotkeys(hotKey);
  }
};

const registerHotkeys = (hotkey: HotKey) => {
  hotkeys.push(hotkey);
  // editorRegisterHotkeys({
  //   modifier,
  //   key,
  //   preventDefault,
  //   action,
  // });
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
