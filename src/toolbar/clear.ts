import { clear } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
import useCommand from '@/modules/useCommand';

const { langConfig } = useLang();
const { execCommand } = useCommand();

export default {
  name: clear,
  icon: 'v-md-icon-clear',
  title: () => langConfig.value.clear.toolbar,
  action() {
    execCommand(clear);
  },
};
