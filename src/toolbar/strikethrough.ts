import { strikethrough } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
import useCommand from '@/modules/useCommand';

const { langConfig } = useLang();
const { execCommand } = useCommand();

export default {
  name: strikethrough,
  icon: 'v-md-icon-strikethrough',
  title: () => langConfig.value.strikethrough.toolbar,
  action() {
    execCommand(strikethrough);
  },
};
