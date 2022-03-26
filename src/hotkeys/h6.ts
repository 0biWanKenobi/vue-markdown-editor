import { h6 } from '@/utils/constants/command';
import useCommand from '@/modules/useCommand';
import { HotKey } from '@/types/hotKeyType';
import type State from '@/classes/state';

export default <HotKey>{
  modifier: 'ctrl',
  key: '6',
  action(state: State) {
    const { execCommand } = useCommand();
    execCommand(h6, state);
  },
};
