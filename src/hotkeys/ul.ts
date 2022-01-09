import { ul } from '@/utils/constants/command';
import useCommand from '@/modules/useCommand';
import { HotKey } from '@/types/hotKeyType';

export default <HotKey>{
  modifier: 'ctrl',
  key: 'u',
  action() {
    const { execCommand } = useCommand();
    execCommand(ul);
  },
};
