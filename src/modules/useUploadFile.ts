import { ref } from 'vue';

type HandleUpload = (e: Event) => void;

export default () => {
  const key = ref(0);
  let handleUpload = ref<HandleUpload>((_) => {});

  const fileInputEl = ref();

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

      fileInputEl.value?.$el.click();
    });
  };

  return {
    key,
    fileInputEl,
    upload,
    handleUpload,
  };
};
