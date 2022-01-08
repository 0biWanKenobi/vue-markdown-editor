import { ref } from 'vue';

const text = ref<string | undefined>('');

const handleInput = (val: string) => {
  text.value = val;
};

export default () => {
  return {
    text,
    handleInput,
  };
};
