import { link } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
import type State from '@/classes/state';
import useCommand from '@/modules/useCommand';

const { langConfig } = useLang();
const { execCommand } = useCommand();

export default {
  name: link,
  icon: 'v-md-icon-link',
  title: () => `${langConfig.value.link.toolbar}（Ctrl+L）`,
  action(state: State) {
    execCommand(link, state);
  },
};
