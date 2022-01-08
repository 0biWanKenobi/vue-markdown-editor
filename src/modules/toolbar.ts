export const toolbarProps = {
  leftToolbar: {
    type: String,
    default:
      'undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code | save',
  },
  rightToolbar: {
    type: String,
    default: 'preview toc sync-scroll fullscreen',
  },
  toolbar: {
    type: Object,
    default: () => ({}),
  },
  disabledMenus: {
    type: Array,
    default: () => ['image/upload-image'],
  },
  toolbarConfig: {
    type: Object,
    default: () => ({}),
  },
};
