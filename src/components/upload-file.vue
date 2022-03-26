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
import { StateSymbol } from '@/classes/state';
import UploadConfig from '@/types/uploadConfigType';
import { defineComponent, inject } from 'vue';
import { object } from 'vue-types';

export default defineComponent({
  name: 'v-md-upload-file',
  props: {
    uploadConfig: object<UploadConfig>().isRequired,
  },
  setup() {
    const state = inject(StateSymbol)!.value;
    const { key, handleUpload, fileInputEl } = state.fileUpload;

    return {
      key,
      fileInputEl,
      handleUpload,
    };
  },
});
</script>
