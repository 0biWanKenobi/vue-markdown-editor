import { h6 } from '@/utils/constants/command';
import useCommand from '@/modules/useCommand';
import { HotKey } from '@/types/hotKeyType';

export default <HotKey>{
  modifier: 'ctrl',
  key: '6',
  action() {
    const { execCommand } = useCommand();
    execCommand(h6);
  },
};
