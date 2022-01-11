import useCommon from '@/modules/useCommon';
import useLang from '@/modules/useLang';
import { generatorText } from '@/utils/util';

import { italic as name } from '@/utils/constants/command';

const command = () => {
  const { insert } = useCommon();

  insert((selected) => {
    const { langConfig } = useLang();
    const prefix = '*';
    const suffix = '*';
    const { placeholder } = langConfig.value.italic;

    const selectedGetter = (selected: string | undefined) => selected || placeholder;
    const { insertContent, newSelected } = generatorText({
      selected,
      InsertGetter: (selected) => `${prefix}${selectedGetter(selected)}${suffix}`,
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
