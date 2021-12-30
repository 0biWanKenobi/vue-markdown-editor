export const vModelProps = {
  modelValue: {
    type: String,
    default: '',
  },
};

export const vModelEmits = ['update:modelValue'];

export default {
  data() {
    return {
      text: this.modelValue,
    };
  },
  methods: {
    handleInput(val) {
      this.text = val;
      this.$emit('update:modelValue', val);
    },
  },
};
