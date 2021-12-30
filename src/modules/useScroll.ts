import useCommon from './useCommon';
import useSyncScroll from './useSyncScroll';
import EDITOR_MODE from '@/utils/constants/editor-mode';
import { ref } from 'vue';
import useEditor from './useEditor';

const previewScrollerEl = ref();
const previewEl = ref();

const { ignoreSyncScroll } = useSyncScroll();
const { mode } = useCommon();

const {
  editor: { heightAtLine, editorScrollToTop },
} = useEditor();

const previewScrollTo = (scrollTop: number) => {
  previewScrollerEl.value?.scrollTo(scrollTop);
};

const scrollToLine = (lineIndex: number) => {
  if (mode.value != EDITOR_MODE.PREVIEW) {
    editorScrollToLine(lineIndex);
  }

  if (mode.value != EDITOR_MODE.EDIT) {
    ignoreSyncScroll.value = true;
    previewScrollToLine({
      lineIndex,
      onScrollEnd: () => {
        ignoreSyncScroll.value = false;
      },
    });
  }
};

const editorScrollToLine = (lineIndex: number) => {
  const offsetTop = heightAtLine(lineIndex - 1, 'local');

  editorScrollToTop(offsetTop);
};

const previewScrollToTarget = (...arg: any[]) => {
  previewEl.value?.scrollToTarget(...arg);
};

const previewScrollToLine = ({ lineIndex, onScrollEnd }) => {
  previewEl.value?.scrollToLine({ lineIndex, onScrollEnd });
};

export default () => {
  return {
    previewScrollerEl,
    previewEl,
    previewScrollTo,
    scrollToLine,
    editorScrollToLine,
    previewScrollToTarget,
    previewScrollToLine,
  };
};
