import { ref } from 'vue';

const leftToolbarItems = ref(
  'undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | save'
);
const rightToolbarItems = ref('preview toc sync-scroll fullscreen');

const toolbarItems = ref<string>();

const setToolbarItems = (items: string) => {};

const setRightToolbarItems = (items: string) => {
  rightToolbarItems.value = items;
};

const setLeftToolbarItems = (items: string) => {
  leftToolbarItems.value = items;
};

export default () => {
  return {
    leftToolbarItems,
    rightToolbarItems,
    toolbarItems,
    setLeftToolbarItems,
    setRightToolbarItems,
    setToolbarItems,
  };
};
