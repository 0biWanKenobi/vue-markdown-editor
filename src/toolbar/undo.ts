import { undo } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
import useCommand from '@/modules/useCommand';

const { langConfig } = useLang();
const { execCommand } = useCommand();

export default {
  name: undo,
  icon: 'v-md-icon-undo',
  title: () => `${langConfig.value.undo.toolbar}（Ctrl+Z）`,
  action() {
    execCommand(undo);
  },
};
