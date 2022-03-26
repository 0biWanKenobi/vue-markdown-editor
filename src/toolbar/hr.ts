import { hr } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
import type State from '@/classes/state';
import useCommand from '@/modules/useCommand';

const { langConfig } = useLang();

export default {
  name: hr,
  icon: 'v-md-icon-horizontal',
  title: () => langConfig.value.hr.toolbar,
  action(state: State) {
    const { execCommand } = useCommand();
    execCommand(hr, state);
  },
};
