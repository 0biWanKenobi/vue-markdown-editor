import { h2 } from '@/utils/constants/command';
import useCommand from '@/modules/useCommand';

export default {
  modifier: 'ctrl',
  key: '2',
  action() {
    const { execCommand } = useCommand();
    execCommand(h2);
  },
};
