import { computed, nextTick, ref, SetupContext, watch } from 'vue';
import EDITOR_MODE from '@/utils/constants/editor-mode';
import useSyncScroll from './useSyncScroll';
import EDITOR_MODE_TYPE from '@/types/editorMode';
import useEditor from './useEditor';
import useScroll from './useScroll';
import LifecycleStage from '@/types/lifecycleStage';
import UploadConfig from '@/types/uploadConfigType';
import useVModel from './useVModel';
import usePreview from './usePreview';

const useCommon = (
  ctx?: SetupContext<string[]> | SetupContext<Record<string, any>>,
  props?: Record<string, any>
) => {
  const uploadConfig = ref<UploadConfig>({});

  const mode = ref<EDITOR_MODE_TYPE>();
  const currentMode = ref(mode.value);
  let data = {};

  const isPreviewMode = computed(() => currentMode.value === EDITOR_MODE.PREVIEW);
  const isEditMode = computed(() => currentMode.value === EDITOR_MODE.EDIT);
  const isEditableMode = computed(() => currentMode.value === EDITOR_MODE.EDITABLE);

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
    },
    {
      flush: 'post',
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
  const handleChange = (text: string, html: string) => {
    ctx?.emit('change', text, html);
  };

  const handleBlur = (e: Event) => {
    ctx?.emit('blur', e);
  };

  const handlePreviewImageClick = (images: Array<any>, currentIndex: number) => {
    ctx?.emit('image-click', images, currentIndex);
  };

  const save = () => {
    const { text } = useVModel();
    const { html } = usePreview();
    // emit('save', this.text, this.$refs.preview.html);
    ctx?.emit('save', text.value, html.value);
  };

  const {
    editor: { getCurrentSelectedStr, replaceSelectionText, changeSelectionTo },
  } = useEditor();

  const insert = (
    getInsertContent: (v: string | undefined) => { text: string; selected?: string }
  ) => {
    focus();

    const currentSelectedStr = getCurrentSelectedStr();
    const { selected, text } = getInsertContent(currentSelectedStr);

    replaceSelectionText(text);

    nextTick(() => {
      changeSelectionTo(text, selected);
    });
  };

  const { setLifeCycleHooks } = useEditor();

  const onMounted = async () => {
    if (props?.autofocus) {
      await nextTick(() => setFocusEnd());
    }
  };

  setLifeCycleHooks(LifecycleStage.mounted, onMounted);

  return {
    data,
    mode,
    currentMode,
    isPreviewMode,
    isEditMode,
    isEditableMode,
    uploadConfig,
    setFocusEnd,
    handleChange,
    handleBlur,
    handlePreviewImageClick,
    save,
    insert,
  };
};

export default useCommon;
