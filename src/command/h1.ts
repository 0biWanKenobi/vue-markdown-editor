import useCommon from '@/modules/useCommon';
import useLang from '@/modules/useLang';
import { generatorText } from '@/utils/util';

import { h1 as name } from '@/utils/constants/command';

const { insert } = useCommon();
const { langConfig } = useLang();

const command = () => {
  insert((selected) => {
    const prefix = '#';
    const { placeholder } = langConfig.value.h1;

    const selectedGetter = (selected: string | undefined) => selected || placeholder;
    const { insertContent, newSelected } = generatorText({
      selected,
      InsertGetter: (selected) => `${prefix} ${selectedGetter(selected)}`,
      selectedGetter,
    });

    return {
      text: insertContent,
      selected: newSelected,
    };
  });
};

Object.defineProperty(command, 'name', { value: name });

export default command;
