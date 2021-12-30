import { ref } from 'vue';
import useEditor from './useEditor';
import useScroll from './useScroll';
import { LINE_MARKUP } from '@/utils/constants/markup';

const syncScroll = ref(true);
const enableSyncScroll = ref(true);
const ignoreSyncScroll = ref(true);
const previewEl = ref();
const previewScrollerEl = ref();
let scrollTimer: NodeJS.Timeout = undefined;

const {
  editor: { getScrollInfo, heightAtLine },
} = useEditor();

const toggleSyncScroll = (enabled = !syncScroll.value) => {
  syncScroll.value = enabled;
};

const { previewScrollTo } = useScroll();

const previewSyncScroll = () => {
  const previewLines = previewEl.value.querySelectorAll(`[${LINE_MARKUP}]`);
  const {
    clientHeight: editorClientHeight,
    top: editorScrollTop,
    height: editorScrollHeight,
  } = getScrollInfo();
  const previewScrollWrapper = previewScrollerEl.value.querySelector('.scrollbar__wrap');

  if (editorClientHeight + editorScrollTop === editorScrollHeight) {
    const { clientHeight } = previewScrollWrapper;
    const { scrollHeight } = previewScrollWrapper;

    previewScrollTo(scrollHeight - clientHeight);
  } else {
    let currentLine;
    let nextLine;

    for (let i = 0; i < previewLines.length; i++) {
      const lineNumber = previewLines[i].getAttribute(LINE_MARKUP);
      const height = heightAtLine(lineNumber - 1, 'local');

      if (height < editorScrollTop) {
        currentLine = lineNumber;
      } else {
        nextLine = lineNumber;
        break;
      }
    }

    let percent = 0;

    if (currentLine && nextLine && currentLine !== nextLine) {
      const currentLineTop = heightAtLine(currentLine - 1, 'local');
      const nextLineTop = heightAtLine(nextLine - 1, 'local');

      percent = (editorScrollTop - currentLineTop) / (nextLineTop - currentLineTop);
    }

    let newLineTop = 0;
    let newNextLineTop = previewScrollWrapper.scrollHeight - previewScrollWrapper.clientHeight;

    if (currentLine) {
      newLineTop = previewEl.value.querySelector(`[${LINE_MARKUP}="${currentLine}"]`).offsetTop;
    }

    if (nextLine) {
      newNextLineTop = previewEl.value.querySelector(`[${LINE_MARKUP}="${nextLine}"]`).offsetTop;
    }

    const newScrollTop = newLineTop + (newNextLineTop - newLineTop) * percent;

    previewScrollTo(newScrollTop);
  }
};

const handleEditorScroll = () => {
  if (!enableSyncScroll.value || ignoreSyncScroll.value) return;

  clearTimeout(scrollTimer);

  scrollTimer = setTimeout(previewSyncScroll, 60);
};

export default () => {
  return {
    syncScroll,
    enableSyncScroll,
    ignoreSyncScroll,
    previewEl,
    previewScrollerEl,
    toggleSyncScroll,
    previewSyncScroll,
    handleEditorScroll,
  };
};
