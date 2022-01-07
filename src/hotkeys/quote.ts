import { quote } from '@/utils/constants/command';
import useCommand from '@/modules/useCommand';

export default {
  modifier: 'ctrl',
  key: 'q',
  action() {
    const { execCommand } = useCommand();
    execCommand(quote);
  },
};
