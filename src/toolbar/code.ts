import { code } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
import useCommand from '@/modules/useCommand';

const { langConfig } = useLang();
const { execCommand } = useCommand();

export default {
  name: code,
  icon: 'v-md-icon-code',
  title: () => langConfig.value.code.toolbar,
  action() {
    execCommand(code);
  },
};
