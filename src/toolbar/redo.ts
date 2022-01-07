import { redo } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
import useCommand from '@/modules/useCommand';

const { langConfig } = useLang();
const { execCommand } = useCommand();

export default {
  name: redo,
  icon: 'v-md-icon-redo',
  title: () => `${langConfig.value.redo.toolbar}（Ctrl+Y）`,
  action() {
    execCommand(redo);
  },
};
