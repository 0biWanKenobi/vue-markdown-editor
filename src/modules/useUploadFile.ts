import { ref } from 'vue';

type HandleUpload = (e: Event) => void;
const fileInputEl = ref();
const handleUpload = ref<HandleUpload>((_) => {});

export default () => {
  const key = ref(0);

  const upload = async () => {
    const event = await chooseFile();

    return event;
  };

  const chooseFile = () => {
    return new Promise<Event>((resolve) => {
      handleUpload.value = (e) => {
        resolve(e);

        // 解决上传同一文件不触发change事件的问题
        key.value++;
      };

      fileInputEl.value?.click();
    });
  };

  return {
    key,
    fileInputEl,
    upload,
    handleUpload,
  };
};
