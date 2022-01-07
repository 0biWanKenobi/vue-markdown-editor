import { quote } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
import useCommand from '@/modules/useCommand';

const { langConfig } = useLang();
const { execCommand } = useCommand();

export default {
  name: quote,
  icon: 'v-md-icon-quote',
  title: () => `${langConfig.value.quote.toolbar}（Ctrl+Q）`,
  action() {
    execCommand(quote);
  },
};
