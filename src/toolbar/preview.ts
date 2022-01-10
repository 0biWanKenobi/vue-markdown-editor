import EDITOR_MODE from '@/utils/constants/editor-mode';
import useLang from '@/modules/useLang';
import useCommon from '@/modules/useCommon';

const { langConfig } = useLang();

export default {
  name: 'preview',
  icon: 'v-md-icon-preview',
  title: () => {
    const previewLang = langConfig.value.preview;
    const { isEditableMode } = useCommon();

    return isEditableMode.value ? previewLang.disabled : previewLang.enabled;
  },
  active: () => useCommon().isEditableMode.value,
  action() {
    const { isEditableMode, currentMode } = useCommon();
    currentMode.value = isEditableMode.value ? EDITOR_MODE.EDIT : EDITOR_MODE.EDITABLE;
  },
};
