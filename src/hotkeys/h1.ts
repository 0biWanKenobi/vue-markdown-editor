import { h1 } from '@/utils/constants/command';
import useCommand from '@/modules/useCommand';

export default {
  modifier: 'ctrl',
  key: '1',
  action() {
    const { execCommand } = useCommand();
    execCommand(h1);
  },
};
