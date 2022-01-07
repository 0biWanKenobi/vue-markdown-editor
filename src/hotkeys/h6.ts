import { h6 } from '@/utils/constants/command';
import useCommand from '@/modules/useCommand';

export default {
  modifier: 'ctrl',
  key: '6',
  action() {
    const { execCommand } = useCommand();
    execCommand(h6);
  },
};
