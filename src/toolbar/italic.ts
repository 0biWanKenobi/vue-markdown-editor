import { italic } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
import type State from '@/classes/state';
import useCommand from '@/modules/useCommand';

const { langConfig } = useLang();
const { execCommand } = useCommand();

export default {
  name: italic,
  icon: 'v-md-icon-italic',
  title: () => `${langConfig.value.italic.toolbar}（Ctrl+I）`,
  action(state: State) {
    execCommand(italic, state);
  },
};
