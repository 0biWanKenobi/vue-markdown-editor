import { computed, ref, SetupContext } from 'vue';
import imageToolbar from '@/toolbar/image';
import { filesFilter, getFilesFromClipboardData } from '@/utils/file';
import { image } from '@/utils/constants/command';
import useCommand from './useCommand';

const { execCommand } = useCommand();

const defaultConfig = {
  accept: 'image/*',
  multiple: false,
};

const propImgConfig = ref();
const uploadImgConfig = computed(() => {
  return {
    ...defaultConfig,
    ...propImgConfig.value,
  };
});

const hasUploadImage = computed(
  (disabledMenus: string | Array<string>) =>
    !disabledMenus.includes(`${imageToolbar.name}/upload-image`)
);

const handleDrop = (e: DragEvent) => {
  if (!e.dataTransfer) return;
  const files = filesFilter(e.dataTransfer.files, uploadImgConfig);
  emitUploadImage(e, Array.from(files));
};

const handlePaste = (e: ClipboardEvent) => {
  const { clipboardData } = e;

  if (!clipboardData) return;

  const files = filesFilter(getFilesFromClipboardData(clipboardData), uploadImgConfig.value);

  emitUploadImage(e, Array.from(files));
};

const emitUploadImage = (e: Event, files: File[]) => {
  if (hasUploadImage.value && files.length) {
    e.preventDefault();

    ctx.value?.emit(
      'upload-image',
      e,
      (imageConfig: any) => {
        execCommand(image, imageConfig);
      },
      files
    );
  }
};

const ctx = ref<SetupContext<string[]> | SetupContext<Record<string, any>>>();

export default (
  _ctx?: SetupContext<string[]> | SetupContext<Record<string, any>>,
  _propImgConfig?: any
) => {
  propImgConfig.value = _propImgConfig;
  ctx.value = _ctx;
  return {
    emitUploadImage,
    uploadImgConfig,
    hasUploadImage,
    handleDrop,
    handlePaste,
  };
};
