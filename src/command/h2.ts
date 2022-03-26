import useLang from '@/modules/useLang';
import { generatorText } from '@/utils/util';

import { h2 as name } from '@/utils/constants/command';

import type State from '@/classes/state';

const command = (state: State) => {
  const { langConfig } = useLang();
  state.insert((selected) => {
    const prefix = '##';
    const { placeholder }: { placeholder: string } = langConfig.value.h2;

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
