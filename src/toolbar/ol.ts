import { ol } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
import type State from '@/classes/state';
import useCommand from '@/modules/useCommand';

const { langConfig } = useLang();
const { execCommand } = useCommand();

export default {
  name: ol,
  icon: 'v-md-icon-ol',
  title: () => `${langConfig.value.ol.toolbar}（Ctrl+O）`,
  action(state: State) {
    execCommand(ol, state);
  },
};
