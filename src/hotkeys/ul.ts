import { ul } from '@/utils/constants/command';
import useCommand from '@/modules/useCommand';

export default {
  modifier: 'ctrl',
  key: 'u',
  action() {
    const { execCommand } = useCommand();
    execCommand(ul);
  },
};
