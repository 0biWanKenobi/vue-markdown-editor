import { nextTick, ref, SetupContext, watch } from 'vue';
import EDITOR_MODE from '@/utils/constants/editor-mode';
import useSyncScroll from './useSyncScroll';
import useEditor from './useEditor';
import LifecycleStage from '@/types/lifecycleStage';
import UploadConfig from '@/types/uploadConfigType';
import useText from './useText';
import usePreview from './usePreview';
import useEditorMode from './useEditorMode';

const ctx = ref<SetupContext<any>>();

const setFocusEnd = () => {
  const {
    editor: { editorFocusEnd, editorScrollToTop },
  } = useEditor();

  const { previewScrollTo } = usePreview();

  editorFocusEnd();
  editorScrollToTop(9999);
  previewScrollTo(9999);
};

// change event
const handleChange = (text: string, html: string) => {
  ctx.value?.emit('change', text, html);
};

const handleBlur = (e: Event) => {
  ctx.value?.emit('blur', e);
};

const handlePreviewImageClick = (images: Array<any>, currentIndex: number) => {
  ctx.value?.emit('image-click', images, currentIndex);
};

const save = () => {
  const { text } = useText();
  const { html } = usePreview();
  // emit('save', this.text, this.$refs.preview.html);
  ctx.value?.emit('save', text.value, html.value);
};

const insert = (
  getInsertContent: (v: string | undefined) => { text: string; selected?: string }
) => {
  const {
    editor: { focus },
  } = useEditor();
  focus();

  const {
    editor: { getCurrentSelectedStr, replaceSelectionText, changeSelectionTo },
  } = useEditor();

  const currentSelectedStr = getCurrentSelectedStr();
  const { selected, text } = getInsertContent(currentSelectedStr);

  replaceSelectionText(text);

  nextTick(() => {
    changeSelectionTo(text, selected);
  });
};

const areHooksSaved = ref(false);

const useCommon = (_ctx?: SetupContext<any>, props?: Record<string, any>) => {
  if (_ctx) ctx.value = _ctx;

  const uploadConfig = ref<UploadConfig>({});

  const data = {};

  const { currentMode } = useEditorMode();

  watch(
    () => props?.mode,
    (newValue) => newValue && (currentMode.value = newValue),
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

  if (!areHooksSaved.value) {
    areHooksSaved.value = true;
    const { setLifeCycleHooks } = useEditor();

    const onMounted = async () => {
      if (props?.autofocus) {
        await nextTick(() => setFocusEnd());
      }
    };

    setLifeCycleHooks(LifecycleStage.mounted, onMounted);
  }

  return {
    data,
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
