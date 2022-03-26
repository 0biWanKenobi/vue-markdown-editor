import { bold } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
import type State from '@/classes/state';
import useCommand from '@/modules/useCommand';

const { langConfig } = useLang();

export default {
  name: bold,
  icon: 'v-md-icon-bold',
  title: () => `${langConfig.value.bold.toolbar}（Ctrl+B）`,
  action(state: State) {
    const { execCommand } = useCommand();
    execCommand(bold, state);
  },
};
