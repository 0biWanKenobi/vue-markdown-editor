import { bold } from '@/utils/constants/command';
import useCommand from '@/modules/useCommand';
import { HotKey } from '@/types/hotKeyType';

export default <HotKey>{
  modifier: 'ctrl',
  key: 'b',
  action() {
    const { execCommand } = useCommand();
    execCommand(bold);
  },
};
