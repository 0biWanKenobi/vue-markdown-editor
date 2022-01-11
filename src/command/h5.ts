import useLang from '@/modules/useLang';
import useCommon from '@/modules/useCommon';
import { generatorText } from '@/utils/util';

import { h5 as name } from '@/utils/constants/command';

const command = () => {
  const { insert } = useCommon();

  insert((selected) => {
    const { langConfig } = useLang();
    const prefix = '#####';
    const { placeholder } = langConfig.value.h5;

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
