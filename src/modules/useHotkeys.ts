import * as Hotkeys from '../hotkeys';
import useCommon from './useCommon';
import useEditor from './useEditor';

const { isPreviewMode } = useCommon();
const {
  editor: { editorRegisterHotkeys },
} = useEditor();

const onMounted = () => {
  if (isPreviewMode.value) return;

  for (let hotKey of Object.values(Hotkeys)) registerHotkeys(hotKey);
};

const registerHotkeys = ({
  modifier,
  key,
  action,
  preventDefault = true,
}: {
  modifier?: string;
  key: string;
  action: Function;
  preventDefault?: boolean;
}) => {
  editorRegisterHotkeys({
    modifier,
    key,
    preventDefault,
    action,
  });
};

export default () => {
  return {
    onMounted,
    registerHotkeys,
  };
};
