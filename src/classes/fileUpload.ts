import { ref } from 'vue';

type HandleUpload = (e: Event) => void;

class FileUpload {
  fileInputEl = ref();
  readonly handleUpload = ref<HandleUpload>((_) => {});

  key = ref(0);

  upload = async () => {
    const event = await this.chooseFile();

    return event;
  };

  chooseFile = () => {
    return new Promise<Event>((resolve) => {
      this.handleUpload.value = (e) => {
        resolve(e);

        this.key.value++;
      };

      this.fileInputEl.value?.click();
    });
  };
}

export default FileUpload;
