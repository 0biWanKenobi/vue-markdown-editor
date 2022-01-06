<template>
  <input
    type="file"
    style="display: none"
    :key="key"
    :accept="uploadConfig.accept"
    :multiple="uploadConfig.multiple"
    @input="handleUpload"
    ref="fileInputEl"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import VueTypes from 'vue-types';

export default defineComponent({
  name: 'v-md-upload-file',
  props: {
    uploadConfig: VueTypes.object.isRequired,
  },
  setup() {
    const key = ref(0);
    let handleUpload = (e: Event) => {};

    const fileInputEl = ref();

    const upload = async () => {
      const event = await chooseFile();

      return event;
    };

    const chooseFile = () => {
      return new Promise((resolve) => {
        handleUpload = (e) => {
          resolve(e);

          // 解决上传同一文件不触发change事件的问题
          key.value++;
        };

        fileInputEl.value?.$el.click();
      });
    };

    return {
      key,
      handleUpload,
      fileInputEl,
    };
  },
});
</script>
