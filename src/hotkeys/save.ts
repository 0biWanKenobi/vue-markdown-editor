import { HotKey } from '@/types/hotKeyType';
import type State from '@/classes/state';

export default <HotKey>{
  modifier: 'ctrl',
  key: 's',
  action(state: State) {
    state.save();
  },
};
