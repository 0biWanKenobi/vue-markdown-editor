import { strikethrough } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
import type State from '@/classes/state';
import useCommand from '@/modules/useCommand';

const { langConfig } = useLang();
const { execCommand } = useCommand();

export default {
  name: strikethrough,
  icon: 'v-md-icon-strikethrough',
  title: () => langConfig.value.strikethrough.toolbar,
  action(state: State) {
    execCommand(strikethrough, state);
  },
};
