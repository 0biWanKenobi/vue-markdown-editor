import { ul } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
import useCommand from '@/modules/useCommand';

const { langConfig } = useLang();
const { execCommand } = useCommand();

export default {
  name: ul,
  icon: 'v-md-icon-ul',
  title: () => `${langConfig.value.ul.toolbar}（Ctrl+U）`,
  action() {
    execCommand(ul);
  },
};
