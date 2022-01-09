import { ref } from 'vue';

const leftToolbarItems = ref(
  'undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | save'
);
const rightToolbarItems = ref('preview toc sync-scroll fullscreen');

const customToolbarItems = ref<string[]>();

const setCustomToolbarItems = (items: string[]) => {
  customToolbarItems.value = items;
};

const setRightToolbarItems = (items: string) => {
  rightToolbarItems.value = items;
};

const setLeftToolbarItems = (items: string) => {
  leftToolbarItems.value = items;
};

const getterMap = {
  ['left']: () => leftToolbarItems.value,
  ['right']: () => rightToolbarItems.value,
};

const getToolbarItems = (key: 'left' | 'right') => {
  return getterMap[key]();
};

export default () => {
  return {
    leftToolbarItems,
    rightToolbarItems,
    customToolbarItems,
    setLeftToolbarItems,
    setRightToolbarItems,
    setCustomToolbarItems,
    getToolbarItems,
  };
};
