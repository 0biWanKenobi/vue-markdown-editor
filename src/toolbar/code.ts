import { code } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
import type State from '@/classes/state';
import useCommand from '@/modules/useCommand';

const { langConfig } = useLang();

export default {
  name: code,
  icon: 'v-md-icon-code',
  title: () => langConfig.value.code.toolbar,
  action(state: State) {
    const { execCommand } = useCommand();
    execCommand(code, state);
  },
};
