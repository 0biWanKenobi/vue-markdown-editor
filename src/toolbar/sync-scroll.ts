import { syncScroll } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
import useCommand from '@/modules/useCommand';
import useSyncScroll from '@/modules/useSyncScroll';

const { langConfig } = useLang();
const { execCommand } = useCommand();
const { enableSyncScroll } = useSyncScroll();

export default {
  name: syncScroll,
  icon: 'v-md-icon-sync',
  title: () => {
    const syncScrollLang = langConfig.value.syncScroll;

    return enableSyncScroll ? syncScrollLang.disabled : syncScrollLang.enabled;
  },
  active: () => enableSyncScroll.value,
  action() {
    execCommand(syncScroll, !enableSyncScroll);
  },
};
