import { clear } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
import type State from '@/classes/state';
import useCommand from '@/modules/useCommand';

const { langConfig } = useLang();

export default {
  name: clear,
  icon: 'v-md-icon-clear',
  title: () => langConfig.value.clear.toolbar,
  action(state: State) {
    const { execCommand } = useCommand();
    execCommand(clear, state);
  },
};
