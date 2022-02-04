import { ref } from 'vue';

const tocVisible = ref(false);

const toggleToc = (visible = !tocVisible.value) => {
  tocVisible.value = visible;
};

export default () => {
  return {
    tocVisible,
    toggleToc,
  };
};
