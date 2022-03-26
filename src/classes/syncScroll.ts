import { ref } from 'vue';
import type IEditor from '@/interfaces/IEditor';
import type Preview from './preview';
import type ScrollBar from './scrollBar';
import { LINE_MARKUP } from '@/utils/constants/markup';

class SyncScroll {
  enableSyncScroll = ref(true);
  ignoreSyncScroll = ref(false);
  scrollTimer: NodeJS.Timeout | undefined = undefined;
  private getPreview;
  private getEditor;
  private getScrollbar;

  constructor(
    getPreview: () => Preview,
    getEditor: () => IEditor,
    getScrollbar: (type: 'editor' | 'preview' | undefined) => ScrollBar
  ) {
    this.getPreview = getPreview;
    this.getEditor = getEditor;
    this.getScrollbar = getScrollbar;
  }

  toggleSyncScroll = (enabled = !this.enableSyncScroll.value) => {
    this.enableSyncScroll.value = enabled;
  };

  previewSyncScroll = () => {
    const { wrapEl } = this.getScrollbar('preview');
    const previewScrollWrapper = wrapEl.value; // should be div.scrollbar__wrap
    const { previewEl } = this.getPreview(); // should be div.v-md-editor-preview
    const previewLines = previewEl.value?.querySelectorAll(`[${LINE_MARKUP}]`) ?? [];

    // previewScrollerEl should be div.scrollbar
    const { getScrollInfo, heightAtLine } = this.getEditor();

    // should get lengths from left-side div.scrollbar__wrap
    const {
      clientHeight: editorClientHeight,
      top: editorScrollTop,
      height: editorScrollHeight,
    } = getScrollInfo();

    if (editorClientHeight + editorScrollTop === editorScrollHeight) {
      const { clientHeight } = previewScrollWrapper;
      const { scrollHeight } = previewScrollWrapper;

      const { previewScrollTo } = this.getPreview();

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

    const { previewScrollTo } = this.getPreview();
    previewScrollTo(newScrollTop);
  };

  handleEditorScroll = () => {
    if (!this.enableSyncScroll.value || this.ignoreSyncScroll.value) return;

    this.scrollTimer && clearTimeout(this.scrollTimer);

    this.scrollTimer = setTimeout(this.previewSyncScroll, 60);
  };
}

export default SyncScroll;
