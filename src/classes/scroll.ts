import type IEditor from '@/interfaces/IEditor';
import type Preview from './preview';

class Scroll {
  private ignoreSyncScroll: (state: boolean) => void;
  private isPreviewMode: () => boolean;
  private isEditMode: () => boolean;
  private getEditor: () => IEditor;
  private getPreview: () => Preview;

  constructor(
    ignoreSyncScroll: () => boolean,
    isPreviewMode: () => boolean,
    isEditMode: () => boolean,
    getEditor: () => IEditor,
    getPreview: () => Preview
  ) {
    this.ignoreSyncScroll = ignoreSyncScroll;
    this.isPreviewMode = isPreviewMode;
    this.isEditMode = isEditMode;
    this.getEditor = getEditor;
    this.getPreview = getPreview;
  }

  scrollToLine = (lineIndex: number) => {
    if (this.isPreviewMode()) {
      this._editorScrollToLine(lineIndex);
    }

    if (this.isEditMode()) return;

    this.ignoreSyncScroll(true);
    this._previewScrollToLine({
      lineIndex,
      onScrollEnd: () => {
        this.ignoreSyncScroll(false);
      },
    });
  };

  _editorScrollToLine = (lineIndex: number) => {
    const { heightAtLine, editorScrollToTop } = this.getEditor();
    const offsetTop = heightAtLine(lineIndex - 1, 'local');

    editorScrollToTop(offsetTop);
  };

  _previewScrollToLine = ({
    lineIndex,
    onScrollEnd,
  }: {
    lineIndex: number;
    onScrollEnd: Function;
  }) => {
    const { scrollToLine } = this.getPreview();
    scrollToLine({ lineIndex, onScrollEnd });
  };
}

export default Scroll;
