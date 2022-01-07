import { italic } from '@/utils/constants/command';
import useCommand from '@/modules/useCommand';

export default {
  modifier: 'ctrl',
  key: 'i',
  action() {
    const { execCommand } = useCommand();
    execCommand(italic);
  },
};
