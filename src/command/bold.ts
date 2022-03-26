import useLang from '@/modules/useLang';
import { generatorText } from '@/utils/util';

import { bold as name } from '@/utils/constants/command';
import type State from '@/classes/state';

const { langConfig } = useLang();

const command = (state: State) => {
  state.insert((selected) => {
    const prefix = '**';
    const suffix = '**';
    const { placeholder }: { placeholder: string } = langConfig.value.bold;

    const selectedGetter = (v: string | undefined) => v || placeholder;
    const { insertContent, newSelected } = generatorText({
      selected,
      InsertGetter: (selected?: string) => `${prefix}${selectedGetter(selected)}${suffix}`,
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
