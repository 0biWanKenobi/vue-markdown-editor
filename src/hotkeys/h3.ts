import { h3 } from '@/utils/constants/command';
import useCommand from '@/modules/useCommand';

export default {
  modifier: 'ctrl',
  key: '3',
  action() {
    const { execCommand } = useCommand();
    execCommand(h3);
  },
};
