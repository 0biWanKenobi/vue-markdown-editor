import { h5 } from '@/utils/constants/command';
import useCommand from '@/modules/useCommand';

export default {
  modifier: 'ctrl',
  key: '5',
  action() {
    const { execCommand } = useCommand();
    execCommand(h5);
  },
};
