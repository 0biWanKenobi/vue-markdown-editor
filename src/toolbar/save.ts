import useLang from '@/modules/useLang';
import useCommon from '@/modules/useCommon';

const { langConfig } = useLang();
const { save } = useCommon();

export default {
  name: 'save',
  icon: 'v-md-icon-save',
  title: () => `${langConfig.value.save.toolbar}（Ctrl+S）`,
  action() {
    save();
  },
};
