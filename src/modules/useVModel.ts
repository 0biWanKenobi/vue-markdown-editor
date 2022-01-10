import { ref } from 'vue';

const text = ref<string | undefined>('');

const handleInput = (val: string) => {
  text.value = val;
};

export default (_text?: string) => {
  if (_text) text.value = _text;
  return {
    text,
    handleInput,
  };
};
