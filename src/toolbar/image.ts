import useCommand from '@/modules/useCommand';
import useCommon from '@/modules/useCommon';
import useLang from '@/modules/useLang';
import useUploadFile from '@/modules/useUploadFile';
import useUploadImage from '@/modules/useUploadImage';
import { image } from '@/utils/constants/command';
import { filesFilter } from '@/utils/file';
import { nextTick } from 'vue';

const { langConfig } = useLang();
const { execCommand } = useCommand();

const { uploadImgConfig, emitUploadImage } = useUploadImage();

export default {
  name: image,
  icon: 'v-md-icon-img',
  title: () => langConfig.value.image.toolbar,
  menus: [
    {
      name: 'image-link',
      text: () => langConfig.value.imageLink.toolbar,
      action(config: any) {
        if (config?.insertWithSize) {
          execCommand(image, { width: 'auto', height: 'auto' });
        } else {
          execCommand(image);
        }
      },
    },
    {
      name: 'upload-image',
      text: () => langConfig.value.uploadImage.toolbar,
      async action() {
        const { uploadConfig } = useCommon();
        uploadConfig.value = uploadImgConfig.value;
        const { upload } = useUploadFile();
        await nextTick();
        const event = await upload();
        const target = event.target as HTMLInputElement;
        if (!target.files) return;
        const files = filesFilter(target.files, uploadImgConfig.value);

        emitUploadImage(event, Array.from(files));
      },
    },
  ],
};
