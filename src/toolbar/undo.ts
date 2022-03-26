import { undo } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
import type State from '@/classes/state';

const { langConfig } = useLang();

export default {
  name: undo,
  icon: 'v-md-icon-undo',
  title: () => `${langConfig.value.undo.toolbar}（Ctrl+Z）`,
  action(state: State) {
    state?.editor.undo();
  },
};
