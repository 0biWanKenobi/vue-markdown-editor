import { ol } from '@/utils/constants/command';
import useCommand from '@/modules/useCommand';

export default {
  modifier: 'ctrl',
  key: 'o',
  action() {
    const { execCommand } = useCommand();
    execCommand(ol);
  },
};
