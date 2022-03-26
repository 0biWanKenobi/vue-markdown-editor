import { ul } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
import type State from '@/classes/state';
import useCommand from '@/modules/useCommand';

const { langConfig } = useLang();
const { execCommand } = useCommand();

export default {
  name: ul,
  icon: 'v-md-icon-ul',
  title: () => `${langConfig.value.ul.toolbar}（Ctrl+U）`,
  action(state: State) {
    execCommand(ul, state);
  },
};
