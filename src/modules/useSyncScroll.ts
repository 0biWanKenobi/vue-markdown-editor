import { ref } from 'vue';
import useEditor from './useEditor';
import useScroll from './useScroll';
import { LINE_MARKUP } from '@/utils/constants/markup';
import usePreview from './usePreview';
import useScrollbar from './useScrollbar';

const syncScroll = ref(true);
const enableSyncScroll = ref(true);
const ignoreSyncScroll = ref(true);
let scrollTimer: NodeJS.Timeout | undefined = undefined;

const {
  editor: { getScrollInfo, heightAtLine },
} = useEditor();

const toggleSyncScroll = (enabled = !syncScroll.value) => {
  syncScroll.value = enabled;
};

const { previewScrollTo } = useScroll();

const previewSyncScroll = () => {
  const { wrapEl } = useScrollbar('preview');
  const previewScrollWrapper = wrapEl.value;
  const { previewEl } = usePreview();
  const previewLines = previewEl.value?.querySelectorAll(`[${LINE_MARKUP}]`) ?? [];
  const {
    clientHeight: editorClientHeight,
    top: editorScrollTop,
    height: editorScrollHeight,
  } = getScrollInfo();

  if (editorClientHeight + editorScrollTop === editorScrollHeight) {
    const { clientHeight } = previewScrollWrapper;
    const { scrollHeight } = previewScrollWrapper;

    previewScrollTo(scrollHeight - clientHeight);
  } else {
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

    previewScrollTo(newScrollTop);
  }
};

const handleEditorScroll = () => {
  if (!enableSyncScroll.value || ignoreSyncScroll.value) return;

  scrollTimer && clearTimeout(scrollTimer);

  scrollTimer = setTimeout(previewSyncScroll, 60);
};

const useSyncScroll = () => {
  return {
    syncScroll,
    enableSyncScroll,
    ignoreSyncScroll,
    toggleSyncScroll,
    previewSyncScroll,
    handleEditorScroll,
  };
};
export default useSyncScroll;
