import VueTypes, { array } from 'vue-types';

export const toolbarProps = {
  leftToolbar: VueTypes.string.def(
    'undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | save'
  ),
  rightToolbar: VueTypes.string.def('preview toc sync-scroll fullscreen'),
  toolbar: VueTypes.object.def({}),
  disabledMenus: array<string>().def(['image/upload-image']),
  toolbarConfig: {
    type: Object,
    default: () => ({}),
  },
};
