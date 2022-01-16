import VueTypes from 'vue-types';

export const previewProps = {
  tabSize: VueTypes.number.def(2),
  scrollContainer: VueTypes.oneOfType([Element, Window]).def(window),
  top: VueTypes.number.def(0),
};

export const previewEmits = ['image-click'];
