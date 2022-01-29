import EDITOR_MODE from '@/utils/constants/editor-mode';
import useLang from '@/modules/useLang';
import useEditorMode from '@/modules/useEditorMode';

const { langConfig } = useLang();

export default {
  name: 'preview',
  icon: 'v-md-icon-preview',
  title: () => {
    const previewLang = langConfig.value.preview;
    const { isEditableMode } = useEditorMode();

    return isEditableMode.value ? previewLang.disabled : previewLang.enabled;
  },
  active: () => useEditorMode().isEditableMode.value,
  action() {
    const { isEditableMode, currentMode } = useEditorMode();
    currentMode.value = isEditableMode.value ? EDITOR_MODE.EDIT : EDITOR_MODE.EDITABLE;
  },
};
