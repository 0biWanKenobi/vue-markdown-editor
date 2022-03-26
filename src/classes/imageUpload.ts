import { computed, ref, SetupContext } from 'vue';
import { filesFilter, getFilesFromClipboardData } from '@/utils/file';
import { image } from '@/utils/constants/command';

type ExecCmd = (cmdName: string, ...params: any[]) => void;

class ImageUpload {
  static defaultConfig = {
    accept: 'image/*',
    multiple: false,
  };

  private ctx: SetupContext<any>;
  private execCommand: ExecCmd;

  propImgConfig = ref();
  disabledMenus = ref<string | string[]>([]);
  uploadImgConfig = computed(() => {
    return {
      ...ImageUpload.defaultConfig,
      ...this.propImgConfig.value,
    };
  });

  hasUploadImage = computed(() => !this.disabledMenus.value.includes(`${image}/upload-image`));

  /**
   *
   */
  constructor(ctx: SetupContext<any>, execCmd: ExecCmd) {
    this.ctx = ctx;
    this.execCommand = execCmd;
  }

  handleDrop = (e: DragEvent) => {
    if (!e.dataTransfer) return;
    const files = filesFilter(e.dataTransfer.files, this.uploadImgConfig);
    this.emitUploadImage(e, Array.from(files));
  };

  handlePaste = (e: ClipboardEvent) => {
    const { clipboardData } = e;

    if (!clipboardData) return;

    const files = filesFilter(getFilesFromClipboardData(clipboardData), this.uploadImgConfig.value);

    this.emitUploadImage(e, Array.from(files));
  };

  emitUploadImage = (e: Event, files: File[]) => {
    if (!this.hasUploadImage.value || !files.length) return;
    e.preventDefault();

    this.ctx.emit(
      'upload-image',
      e,
      (imageConfig: any) => {
        this.execCommand(image, imageConfig);
      },
      files
    );
  };
}

export default ImageUpload;
