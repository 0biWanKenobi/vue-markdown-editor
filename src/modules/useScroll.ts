import useCommon from './useCommon';
import useSyncScroll from './useSyncScroll';
import EDITOR_MODE from '@/utils/constants/editor-mode';
import useEditor from './useEditor';
import { computed } from 'vue';
import usePreview from './usePreview';
import useScrollbar from './useScrollbar';

const getPreviewScrollContainer = computed(() => {
  const { wrapEl } = useScrollbar('preview');
  const { isPreviewMode } = useCommon();
  const previewScrollContainer = wrapEl.value;
  const defaultContainer = isPreviewMode.value ? window : previewScrollContainer;

  return propScrollContainer ? propScrollContainer() : defaultContainer;
});

const {
  editor: { heightAtLine, editorScrollToTop },
} = useEditor();

const previewScrollTo = (scrollTop: number) => {
  const { scrollTo } = useScrollbar('preview');
  scrollTo(scrollTop);
};

const scrollToLine = (lineIndex: number) => {
  const { currentMode } = useCommon();
  if (currentMode.value != EDITOR_MODE.PREVIEW) {
    editorScrollToLine(lineIndex);
  }

  if (currentMode.value != EDITOR_MODE.EDIT) {
    const { ignoreSyncScroll } = useSyncScroll();
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
  const { previewEl } = usePreview();
  previewEl.value?.scrollToTarget(...arg);
};

const previewScrollToLine = ({
  lineIndex,
  onScrollEnd,
}: {
  lineIndex: number;
  onScrollEnd: Function;
}) => {
  const { previewEl } = usePreview();
  previewEl.value?.scrollToLine({ lineIndex, onScrollEnd });
};

let propScrollContainer: () => Element;

export default () => {
  return {
    propScrollContainer,
    previewScrollTo,
    scrollToLine,
    editorScrollToLine,
    previewScrollToTarget,
    previewScrollToLine,
    getPreviewScrollContainer,
  };
};
