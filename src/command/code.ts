import { code as name } from '@/utils/constants/command';

import type State from '@/classes/state';

const command = (state: State) => {
  state.insert((selected) => {
    const prefix = '``` language';
    const suffix = '```';
    let text = `${prefix}\n${suffix}`;

    if (selected) {
      text = `${prefix}\n  ${selected}\n${suffix}`;
    }

    return {
      text,
      selected: 'language',
    };
  });
};

Object.defineProperty(command, 'name', { value: name });

export default command;
