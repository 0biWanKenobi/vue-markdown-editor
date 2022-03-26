import { undo as name } from '@/utils/constants/command';

import type State from '@/classes/state';

const command = (state: State) => {
  state.editor.undo();
};

Object.defineProperty(command, 'name', { value: name });

export default command;
