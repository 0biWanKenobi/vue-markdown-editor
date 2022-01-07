import useLang from '@/modules/useLang';
import useToc from '@/modules/useToc';

const { langConfig } = useLang();
const { tocVisible, toggleToc } = useToc();

export default {
  name: 'toc',
  icon: 'v-md-icon-toc',
  title: () => {
    const tocLang = langConfig.value.toc;

    return tocVisible.value ? tocLang.disabled : tocLang.enabled;
  },
  active: () => tocVisible.value,
  action() {
    toggleToc();
  },
};
