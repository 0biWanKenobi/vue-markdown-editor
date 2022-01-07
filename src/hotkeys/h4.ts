import { h4 } from '@/utils/constants/command';
import useCommand from '@/modules/useCommand';

export default {
  modifier: 'ctrl',
  key: '4',
  action() {
    const { execCommand } = useCommand();
    execCommand(h4);
  },
};
