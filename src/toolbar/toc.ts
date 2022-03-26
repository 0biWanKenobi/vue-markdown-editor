import type State from '@/classes/state';
import useLang from '@/modules/useLang';

export default {
  name: 'toc',
  icon: 'v-md-icon-toc',
  title: (state: State) => {
    const { langConfig } = useLang();
    const tocLang = langConfig.value.toc;

    return state?.tocVisible.value ? tocLang.disabled : tocLang.enabled;
  },
  active: (state: State) => {
    return state?.tocVisible.value;
  },
  action(state: State) {
    state?.toggleToc();
  },
};
