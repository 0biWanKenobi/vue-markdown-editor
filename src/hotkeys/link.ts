import { link } from '@/utils/constants/command';
import useCommand from '@/modules/useCommand';
import { HotKey } from '@/types/hotKeyType';

export default <HotKey>{
  modifier: 'ctrl',
  key: 'l',
  action() {
    const { execCommand } = useCommand();
    execCommand(link);
  },
};
