import { redo } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
import type State from '@/classes/state';

const { langConfig } = useLang();

export default {
  name: redo,
  icon: 'v-md-icon-redo',
  title: () => `${langConfig.value.redo.toolbar}（Ctrl+Y）`,
  action(state: State) {
    state?.editor.redo();
  },
};
