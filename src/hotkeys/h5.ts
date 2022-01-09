import { h5 } from '@/utils/constants/command';
import useCommand from '@/modules/useCommand';
import { HotKey } from '@/types/hotKeyType';

export default <HotKey>{
  modifier: 'ctrl',
  key: '5',
  action() {
    const { execCommand } = useCommand();
    execCommand(h5);
  },
};
