import { computed, ref } from 'vue';
import EDITOR_MODE from '@/utils/constants/editor-mode';

const currentMode = ref(EDITOR_MODE.EDITABLE);
const isPreviewMode = computed(() => currentMode.value === EDITOR_MODE.PREVIEW);
const isEditMode = computed(() => currentMode.value === EDITOR_MODE.EDIT);
const isEditableMode = computed(() => currentMode.value === EDITOR_MODE.EDITABLE);

export default () => {
  return {
    currentMode,
    isPreviewMode,
    isEditMode,
    isEditableMode,
  };
};
