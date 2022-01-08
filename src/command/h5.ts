import useLang from '@/modules/useLang';
import useCommon from '@/modules/useCommon';
import { generatorText } from '@/utils/util';

const { insert } = useCommon();
const { langConfig } = useLang();

import { h5 as name } from '@/utils/constants/command';

const command = () => {
  insert((selected) => {
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
