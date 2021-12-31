import { computed, nextTick, ref, watch } from 'vue';
import EDITOR_MODE from '@/utils/constants/editor-mode';
import useSyncScroll from './useSyncScroll';
import EDITOR_MODE_TYPE from '@/types/editorMode';
import useEditor from './useEditor';
import useScroll from './useScroll';

export default () => {
  const mode = ref<EDITOR_MODE_TYPE>();
  const currentMode = ref(mode.value);
  let data = {};

  const isPreviewMode = computed(() => currentMode.value === EDITOR_MODE.PREVIEW);
  const isEditMode = computed(() => currentMode.value === EDITOR_MODE.EDIT);

  watch(
    () => mode.value,
    (newValue) => (currentMode.value = newValue),
    {
      immediate: true,
    }
  );

  const { enableSyncScroll, previewSyncScroll } = useSyncScroll();

  watch(
    () => currentMode.value,
    async (newValue) => {
      if (newValue === EDITOR_MODE.EDITABLE && enableSyncScroll.value) {
        await nextTick(previewSyncScroll);
      }
    }
  );

  const {
    editor: { editorFocusEnd, editorScrollToTop, focus },
  } = useEditor();

  const { previewScrollTo } = useScroll();

  const setFocusEnd = () => {
    editorFocusEnd();
    editorScrollToTop(9999);
    previewScrollTo(9999);
  };

  // change event
  const handleChange = (emit, text, html) => {
    emit('change', text, html);
  };

  const handleBlur = (emit, e) => {
    emit('blur', e);
  };

  const handlePreviewImageClick = (emit, images, currentIndex) => {
    emit('image-click', images, currentIndex);
  };

  const save = (emit, text, html) => {
    // emit('save', this.text, this.$refs.preview.html);
    emit('save', text, html);
  };

  const {
    editor: { getCurrentSelectedStr, replaceSelectionText, changeSelectionTo },
  } = useEditor();

  const insert = (getInsertContent: (v: string) => { text: string; selected?: string }) => {
    focus();

    const currentSelectedStr = getCurrentSelectedStr();
    const { selected, text } = getInsertContent(currentSelectedStr);

    replaceSelectionText(text);

    nextTick(() => {
      changeSelectionTo(text, selected);
    });
  };

  const onCreated = (theme, options) => {
    if (theme) options.use(theme);
  };

  const onMounted = async (isAutofocused: boolean) => {
    if (isAutofocused) {
      await nextTick(() => setFocusEnd());
    }
  };

  return {
    data,
    mode,
    currentMode,
    isPreviewMode,
    isEditMode,
    setFocusEnd,
    handleChange,
    handleBlur,
    handlePreviewImageClick,
    save,
    insert,
    onCreated,
    onMounted,
  };
};
