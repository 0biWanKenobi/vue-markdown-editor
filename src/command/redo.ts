import { redo as name } from '@/utils/constants/command';

import type State from '@/classes/state';

const command = (state: State) => {
  state.editor.redo();
};

Object.defineProperty(command, 'name', { value: name });

export default command;
