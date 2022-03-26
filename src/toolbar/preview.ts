import EDITOR_MODE from '@/utils/constants/editor-mode';
import useLang from '@/modules/useLang';
import type State from '@/classes/state';

const { langConfig } = useLang();

export default {
  name: 'preview',
  icon: 'v-md-icon-preview',
  title: (state: State) => {
    const previewLang = langConfig.value.preview;

    return state.isEditableMode.value ? previewLang.disabled : previewLang.enabled;
  },
  active: (state: State) => state.isEditableMode.value,
  action(state: State) {
    const { isEditableMode, currentMode } = state;
    currentMode.value = isEditableMode.value ? EDITOR_MODE.EDIT : EDITOR_MODE.EDITABLE;
  },
};
