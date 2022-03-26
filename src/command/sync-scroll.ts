import type State from '@/classes/state';
import { syncScroll as name } from '@/utils/constants/command';

const command = (state: State) => {
  state.syncScroll.toggleSyncScroll();
};

Object.defineProperty(command, 'name', { value: name });

export default command;
