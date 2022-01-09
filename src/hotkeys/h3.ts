import { h3 } from '@/utils/constants/command';
import useCommand from '@/modules/useCommand';
import { HotKey } from '@/types/hotKeyType';

export default <HotKey>{
  modifier: 'ctrl',
  key: '3',
  action() {
    const { execCommand } = useCommand();
    execCommand(h3);
  },
};
