import { ref } from 'vue';
import useEditor from './useEditor';
import { LINE_MARKUP } from '@/utils/constants/markup';
import usePreview from './usePreview';
import useScrollbar from './useScrollbar';

const enableSyncScroll = ref(true);
const ignoreSyncScroll = ref(true);
let scrollTimer: NodeJS.Timeout | undefined = undefined;

const toggleSyncScroll = (enabled = !enableSyncScroll.value) => {
  enableSyncScroll.value = enabled;
};

const previewSyncScroll = () => {
  const { wrapEl } = useScrollbar('preview');
  const previewScrollWrapper = wrapEl.value;
  const { previewEl } = usePreview();
  const previewLines = previewEl.value?.querySelectorAll(`[${LINE_MARKUP}]`) ?? [];

  const {
    editor: { getScrollInfo, heightAtLine },
  } = useEditor();

  const {
    clientHeight: editorClientHeight,
    top: editorScrollTop,
    height: editorScrollHeight,
  } = getScrollInfo();

  if (editorClientHeight + editorScrollTop === editorScrollHeight) {
    const { clientHeight } = previewScrollWrapper;
    const { scrollHeight } = previewScrollWrapper;

    const { previewScrollTo } = usePreview();

    previewScrollTo(scrollHeight - clientHeight);
    return;
  }

    let currentLine: number | undefined;
    let nextLine: number | undefined;

    for (let i = 0; i < previewLines.length; i++) {
      const lineNumber = parseInt(previewLines[i]!.getAttribute(LINE_MARKUP)!);
      const height = heightAtLine(lineNumber - 1, 'local');

      if (height < editorScrollTop) {
        currentLine = lineNumber;
      } else {
        nextLine = lineNumber;
        break;
      }
    }

    let percent = 0;

    if (currentLine !== nextLine && currentLine && nextLine) {
      const currentLineTop = heightAtLine(currentLine - 1, 'local');
      const nextLineTop = heightAtLine(nextLine - 1, 'local');

      percent = (editorScrollTop - currentLineTop) / (nextLineTop - currentLineTop);
    }

    let newLineTop = 0;
    let newNextLineTop = previewScrollWrapper.scrollHeight - previewScrollWrapper.clientHeight;

    if (currentLine) {
      const lineElement = previewEl.value?.querySelector(`[${LINE_MARKUP}="${currentLine}"]`) as
        | HTMLElement
        | null
        | undefined;
      lineElement && (newLineTop = lineElement.offsetTop);
    }

    if (nextLine) {
      const nextLineElement = previewEl.value?.querySelector(`[${LINE_MARKUP}="${nextLine}"]`) as
        | HTMLElement
        | null
        | undefined;
      nextLineElement && (newNextLineTop = nextLineElement.offsetTop);
    }

    const newScrollTop = newLineTop + (newNextLineTop - newLineTop) * percent;

    const { previewScrollTo } = usePreview();
    previewScrollTo(newScrollTop);
};

const handleEditorScroll = () => {
  if (!enableSyncScroll.value || ignoreSyncScroll.value) return;

  scrollTimer && clearTimeout(scrollTimer);

  scrollTimer = setTimeout(previewSyncScroll, 60);
};

const useSyncScroll = () => {
  return {
    enableSyncScroll,
    ignoreSyncScroll,
    toggleSyncScroll,
    previewSyncScroll,
    handleEditorScroll,
  };
};
export default useSyncScroll;
