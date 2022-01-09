import LifecycleStage from '@/types/lifecycleStage';
import * as Hotkeys from '../hotkeys';
import useCommon from './useCommon';
import useEditor from './useEditor';
import { HotKey } from '@/types/hotKeyType';

const hotkeys: HotKey[] = [];

const { isPreviewMode } = useCommon();
const {
  editor: { editorRegisterHotkeys },
} = useEditor();

const onMounted = () => {
  if (isPreviewMode.value) return;

  for (let hotKey of Object.values(Hotkeys)) editorRegisterHotkeys(hotKey);
  for (const hotKey of hotkeys) {
    editorRegisterHotkeys(hotKey);
  }
};

const { setLifeCycleHooks } = useEditor();
setLifeCycleHooks(LifecycleStage.mounted, onMounted);

const registerHotkeys = (hotkey: HotKey) => {
  hotkeys.push(hotkey);
  // editorRegisterHotkeys({
  //   modifier,
  //   key,
  //   preventDefault,
  //   action,
  // });
};

export default () => {
  return {
    registerHotkeys,
  };
};
