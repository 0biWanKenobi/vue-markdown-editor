import UploadFile from '@/components/upload-file.vue';

export const uploadImageProps = {
  uploadImageConfig: Object,
};

export const uploadImageEmits = ['upload-image'];

export const uploadImageComponents = {
  [UploadFile.name]: UploadFile,
};
