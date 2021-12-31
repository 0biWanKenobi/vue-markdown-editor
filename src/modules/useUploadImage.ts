import { computed, ref } from 'vue';
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

const handleDrop = (emit, e) => {
  const files = filesFilter(e.dataTransfer.files, uploadImgConfig);
  emitUploadImage(emit, e, files);
};

const handlePaste = (emit, e) => {
  const { clipboardData } = e;

  if (!clipboardData) return;

  const files = filesFilter(getFilesFromClipboardData(clipboardData), uploadImgConfig.value);

  emitUploadImage(emit, e, files);
};

const emitUploadImage = (emit, e, files) => {
  if (hasUploadImage.value && files.length) {
    e.preventDefault();

    emit(
      'upload-image',
      e,
      (imageConfig) => {
        execCommand(image, imageConfig);
      },
      files
    );
  }
};

export default () => {
  return {
    propImgConfig,
    uploadImgConfig,
    hasUploadImage,
    handleDrop,
    handlePaste,
  };
};
