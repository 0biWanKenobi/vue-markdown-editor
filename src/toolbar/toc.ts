import useLang from '@/modules/useLang';
import useToc from '@/modules/useToc';

export default {
  name: 'toc',
  icon: 'v-md-icon-toc',
  title: () => {
    const { langConfig } = useLang();
    const tocLang = langConfig.value.toc;

    const { tocVisible } = useToc();
    return tocVisible.value ? tocLang.disabled : tocLang.enabled;
  },
  active: () => {
    const { tocVisible } = useToc();
    return tocVisible.value;
  },
  action() {
    const { toggleToc } = useToc();
    toggleToc();
  },
};
