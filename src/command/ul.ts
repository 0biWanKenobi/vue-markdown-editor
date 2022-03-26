import useLang from '@/modules/useLang';
import { generatorText } from '@/utils/util';

import { ul as name } from '@/utils/constants/command';
import type State from '@/classes/state';

const command = (state: State) => {
  state.insert((selected) => {
    const { langConfig } = useLang();
    const { placeholder } = langConfig.value.ul;

    const selectedGetter = (selected: string | undefined) => selected || placeholder;
    const { insertContent, newSelected } = generatorText({
      selected,
      InsertGetter: (selected) => `- ${selectedGetter(selected)}`,
      selectedGetter,
      ignoreEmptyLine: false,
    });

    return {
      text: insertContent,
      selected: newSelected,
    };
  });
};

Object.defineProperty(command, 'name', { value: name });

export default command;
