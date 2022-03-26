import { hr as name } from '@/utils/constants/command';

import type State from '@/classes/state';

const command = (state: State) => {
  state.insert(() => ({
    text: '------------------------------------',
  }));
};

Object.defineProperty(command, 'name', { value: name });

export default command;
