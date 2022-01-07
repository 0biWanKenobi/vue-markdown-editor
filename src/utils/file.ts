// Modified from https://github.com/ElemeFE/element/blob/dev/packages/upload/src/upload-dragger.vue
export function* filesFilter(files: FileList | File[], config: any) {
  const { accept }: { accept: string } = config;

  for (const file of files) {
    const { type, name } = file;
    const extension = name.indexOf('.') > -1 ? `.${name.split('.').pop()}` : '';
    const baseType = type.replace(/\/.*$/, '');
    const valid = accept
      .split(',')
      .map((type) => type.trim())
      .filter((type) => type)
      .some((acceptedType) => {
        if (/\..+$/.test(acceptedType)) {
          return extension === acceptedType;
        }

        if (/\/\*$/.test(acceptedType)) {
          return baseType === acceptedType.replace(/\/\*$/, '');
        }

        // eslint-disable-next-line no-useless-escape
        if (/^[^\/]+\/[^\/]+$/.test(acceptedType)) {
          return type === acceptedType;
        }

        return false;
      });

    if (valid) yield file;
  }
}

export function getFilesFromClipboardData(clipboardData: DataTransfer) {
  const files: Array<File> = [];

  Object.keys(clipboardData.items).forEach((key) => {
    const item = clipboardData.items[parseInt(key)];

    if (item.kind === 'file') {
      const file = item.getAsFile();

      if (file) files.push(file);
    }
  });

  return files;
}
