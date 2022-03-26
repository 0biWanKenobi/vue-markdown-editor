import useLang from '@/modules/useLang';
import { quote as name } from '@/utils/constants/command';

import type State from '@/classes/state';

const command = (state: State) => {
  state.insert((selected) => {
    const { langConfig } = useLang();
    const prefix = '>';
    const content = selected || langConfig.value.quote.placeholder;

    return {
      text: `${prefix} ${content}`,
      selected: content,
    };
  });
};

Object.defineProperty(command, 'name', { value: name });

export default command;
