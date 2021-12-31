export const previewProps = {
  tabSize: {
    type: Number,
    default: 2,
  },
  scrollContainer: {
    type: Function,
    default: () => window,
  },
  top: {
    type: Number,
    default: 0,
  },
};

export const previewEmits = ['image-click'];
