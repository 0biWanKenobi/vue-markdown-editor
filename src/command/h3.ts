import { generatorText } from '@/utils/util';

export { h3 as name } from '@/utils/constants/command';

export default function (editor) {
  editor.insert((selected) => {
    const prefix = '###';
    const { placeholder } = editor.langConfig.h3;

    const selectedGetter = (selected: string) => selected || placeholder;
    const { insertContent, newSelected } = generatorText({
      selected,
      InsertGetter: (selected: string) => `${prefix} ${selectedGetter(selected)}`,
      selectedGetter,
    });

    return {
      text: insertContent,
      selected: newSelected,
    };
  });
}
