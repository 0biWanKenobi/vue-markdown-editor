// base css
import '@/styles/index.scss';

import Preview from '@/preview';
import Container from '@/components/container';
import Scrollbar from '@/components/scrollbar/index';
import TocNav from '@/components/toc-nav';

import EDITOR_MODE from '@/utils/constants/editor-mode';
import { computed, nextTick, ref, watch } from 'vue';

export const editorProps = {
  height: String,
  theme: Object,
  mode: {
    type: String,
    default: EDITOR_MODE.EDITABLE,
  },
  autofocus: Boolean,
  placeholder: String,
  tocNavPositionRight: Boolean,
  tabSize: {
    type: Number,
    default: 2,
  },
  beforePreviewChange: {
    type: Function,
    default: (text, next) => {
      next(text);
    },
  },
};

export const editorEmits = ['blur', 'change', 'save', 'image-click'];

export const shouldInheritAttrs = false;

export const editorComponents = {
  [Preview.name]: Preview,
  [Container.name]: Container,
  [Scrollbar.name]: Scrollbar,
  [TocNav.name]: TocNav,
};

export const useCommonEditor = (mode) => {
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

  watch(
    () => currentMode.value,
    async (newValue) => {
      if (newValue === EDITOR_MODE.EDITABLE && this.enableSyncScroll) {
        await nextTick(this.previewSyncScroll);
      }
    }
  );

  const setFocusEnd = (focusUtils) => {
    focusUtils.editorFocusEnd();
    focusUtils.editorScrollToTop(9999);
    focusUtils.previewScrollTo(9999);
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

  const insert = (insertUtils) => {
    insertUtils.focus();

    const currentSelectedStr = insertUtils.getCurrentSelectedStr();
    const { selected, text } = getInsertContent(currentSelectedStr);

    insertUtils.replaceSelectionText(text);

    insertUtils.$nextTick(() => {
      insertUtils.changeSelctionTo(text, selected);
    });
  };

  const onCreated = (theme, options) => {
    if (theme) options.use(theme);
  };

  const onMounted = async (isAutofocused, focusUtils) => {
    if (isAutofocused) {
      await nextTick(() => setFocusEnd(focusUtils));
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

export default {
  provide() {
    return {
      markdownEditor: this,
    };
  },
  created() {
    if (this.theme) this.$options.use(this.theme);
  },
};
