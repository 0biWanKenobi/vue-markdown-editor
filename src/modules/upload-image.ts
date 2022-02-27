import UploadFile from '@/components/upload-file.vue';
import UploadConfig from '@/types/uploadConfigType';
import { object } from 'vue-types';

export const uploadImageProps = {
  uploadImageConfig: object<UploadConfig>(),
};

export const uploadImageEmits = ['upload-image'];

export const uploadImageComponents = {
  [UploadFile.name]: UploadFile,
};
