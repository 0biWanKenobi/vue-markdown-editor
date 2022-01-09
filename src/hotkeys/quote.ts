import { quote } from '@/utils/constants/command';
import useCommand from '@/modules/useCommand';
import { HotKey } from '@/types/hotKeyType';

export default <HotKey>{
  modifier: 'ctrl',
  key: 'q',
  action() {
    const { execCommand } = useCommand();
    execCommand(quote);
  },
};
