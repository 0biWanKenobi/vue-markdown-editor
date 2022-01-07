import { table } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
import useCommand from '@/modules/useCommand';

const { langConfig } = useLang();
const { execCommand } = useCommand();

export default {
  name: table,
  icon: 'v-md-icon-table',
  title: () => langConfig.value.table.toolbar,
  action() {
    execCommand(table);
  },
};
