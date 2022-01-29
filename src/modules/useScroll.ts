import useSyncScroll from './useSyncScroll';
import useEditor from './useEditor';
import useEditorMode from './useEditorMode';
import usePreview from './usePreview';

const scrollToLine = (lineIndex: number) => {
  const { isPreviewMode, isEditMode } = useEditorMode();
  if (isPreviewMode) {
    editorScrollToLine(lineIndex);
  }

  if (!isEditMode) {
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
  const {
    editor: { heightAtLine, editorScrollToTop },
  } = useEditor();
  const offsetTop = heightAtLine(lineIndex - 1, 'local');

  editorScrollToTop(offsetTop);
};

const previewScrollToLine = ({
  lineIndex,
  onScrollEnd,
}: {
  lineIndex: number;
  onScrollEnd: Function;
}) => {
  const { scrollToLine } = usePreview();
  scrollToLine({ lineIndex, onScrollEnd });
};

export default () => {
  return {
    scrollToLine,
    editorScrollToLine,
    previewScrollToLine,
  };
};
