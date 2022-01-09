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
import { defineComponent } from 'vue';
import { object } from 'vue-types';

export default defineComponent({
  name: 'v-md-upload-file',
  props: {
    uploadConfig: object<{
      accept?: string;
      multiple?: boolean | 'true' | 'false';
    }>().isRequired,
  },
  setup() {
    const { key, handleUpload } = useUploadFile();

    return {
      key,
      handleUpload,
    };
  },
});
</script>
