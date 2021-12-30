import { ref } from 'vue';

const text = ref<string>('');

const handleInput = (val: string, emit: (e: string, v: string) => void) => {
  text.value = val;
  emit('update:modelValue', val);
};

export default () => {
  return {
    text,
    handleInput,
  };
};
