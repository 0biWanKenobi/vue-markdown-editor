import { syncScroll } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
import useCommand from '@/modules/useCommand';
import useSyncScroll from '@/modules/useSyncScroll';

export default {
  name: syncScroll,
  icon: 'v-md-icon-sync',
  title: () => {
    const { langConfig } = useLang();
    const syncScrollLang = langConfig.value.syncScroll;
    const { enableSyncScroll } = useSyncScroll();

    return enableSyncScroll ? syncScrollLang.disabled : syncScrollLang.enabled;
  },
  active: () => {
    const { enableSyncScroll } = useSyncScroll();
    return enableSyncScroll.value;
  },
  action() {
    const { execCommand } = useCommand();
    const { enableSyncScroll } = useSyncScroll();
    execCommand(syncScroll, !enableSyncScroll);
  },
};
