import type State from '@/classes/state';
import useCommand from '@/modules/useCommand';
import useLang from '@/modules/useLang';
import { image } from '@/utils/constants/command';
import { filesFilter } from '@/utils/file';
import { nextTick } from 'vue';

const { langConfig } = useLang();
const { execCommand } = useCommand();

export default {
  name: image,
  icon: 'v-md-icon-img',
  title: () => langConfig.value.image.toolbar,
  menus: [
    {
      name: 'image-link',
      text: () => langConfig.value.imageLink.toolbar,
      action(config: any, state: State) {
        if (config?.insertWithSize) {
          execCommand(image, state, { width: 'auto', height: 'auto' });
        } else {
          execCommand(image, state);
        }
      },
    },
    {
      name: 'upload-image',
      text: () => langConfig.value.uploadImage.toolbar,
      async action(state: State) {
        await nextTick();
        const event = await state.fileUpload.upload();
        const target = event.target as HTMLInputElement;
        if (!target.files) return;

        const { uploadImgConfig, emitUploadImage } = state.imageUpload;

        const files = filesFilter(target.files, uploadImgConfig.value);

        emitUploadImage(event, Array.from(files));
      },
    },
  ],
};
