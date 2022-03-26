import type State from '@/classes/state';
import useLang from '@/modules/useLang';

const { langConfig } = useLang();

export default {
  name: 'save',
  icon: 'v-md-icon-save',
  title: () => `${langConfig.value.save.toolbar}（Ctrl+S）`,
  action(state: State) {
    state.save();
  },
};
