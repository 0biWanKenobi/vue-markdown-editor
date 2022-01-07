import { bold } from '@/utils/constants/command';
import useCommand from '@/modules/useCommand';

export default {
  modifier: 'ctrl',
  key: 'b',
  action() {
    const { execCommand } = useCommand();
    execCommand(bold);
  },
};
