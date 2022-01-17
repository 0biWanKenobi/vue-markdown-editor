<template>
  <div>
    <v-md-editor
      v-model="text"
      height="500px"
      autofocus
      :disabled-menus="[]"
      toc-nav-position-right
      @upload-image="handleUploadImage"
      @fullscreen-change="handleFullscreenChange"
      @save="handleSave"
      @copy-code-success="handleCopyCodeSuccess"
      ref="editor"
      :toolbar="customToolbar"
      left-toolbar="undo redo clear | h bold italic quote | ul ol table hr | link image | save | myButton my2ndButton"
    >
      <template #myButton>
        <select name="opts">
          <option value="opt1">option 1</option>
          <option value="opt2">option 2</option>
        </select>
      </template>
      <template #my2ndButton>
        <img
          src="https://www.svgrepo.com/show/131974/settings.svg"
          intrinsicsize="512 x 512"
          width="16"
          height="16"
          srcset="https://www.svgrepo.com/show/131974/settings.svg 4x"
          alt="Settings SVG Vector"
        />
      </template>
    </v-md-editor>

    <!-- <v-md-preview-html
      :html="html"
      preview-class="vuepress-markdown-body"
    /> -->
  </div>
</template>

<script lang="ts">
import text from './text';
// import html from './html';
import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
  setup() {
    const customToolbar = {
      myButton: {
        title: 'Options',
        slot: true,
        preventNativeClick: false,
      },
      my2ndButton: {
        title: 'Settings',
        slot: true,
        action() {
          console.log('opening the settings..');
        },
      },
    };

    const handleFullscreenChange = (v: boolean) => {
      console.log(v);
    };

    const handleUploadImage = (_e: Event, insertImage: Function, files: File[]) => {
      console.log(files);

      insertImage({
        url: '111',
        desc: '111',
      });
    };

    const handleSave = (text: string, html: string) => {
      console.log(text, html);
    };

    const handleCopyCodeSuccess = (code: string | undefined) => {
      console.log(code);
    };

    return {
      text,
      // html,
      customToolbar,
      handleFullscreenChange,
      handleUploadImage,
      handleSave,
      handleCopyCodeSuccess,
    };
  },
});
</script>
