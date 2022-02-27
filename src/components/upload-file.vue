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
import useUploadFile from '@/modules/useUploadFile';
import UploadConfig from '@/types/uploadConfigType';
import { defineComponent } from 'vue';
import { object } from 'vue-types';

export default defineComponent({
  name: 'v-md-upload-file',
  props: {
    uploadConfig: object<UploadConfig>().isRequired,
  },
  setup() {
    const { key, handleUpload, fileInputEl } = useUploadFile();

    return {
      key,
      fileInputEl,
      handleUpload,
    };
  },
});
</script>
