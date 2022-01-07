import { bold } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
import useCommand from '@/modules/useCommand';

const { langConfig } = useLang();
const { execCommand } = useCommand();

export default {
  name: bold,
  icon: 'v-md-icon-bold',
  title: () => `${langConfig.value.bold.toolbar}（Ctrl+B）`,
  action() {
    execCommand(bold);
  },
};
