import { syncScroll } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
import type State from '@/classes/state';
import useCommand from '@/modules/useCommand';

export default {
  name: syncScroll,
  icon: 'v-md-icon-sync',
  title: (state: State) => {
    const { langConfig } = useLang();
    const syncScrollLang = langConfig.value.syncScroll;
    const enableSyncScroll = state?.syncScroll.enableSyncScroll.value;

    return enableSyncScroll ? syncScrollLang.disabled : syncScrollLang.enabled;
  },
  active: (state: State) => {
    return state?.syncScroll.enableSyncScroll.value;
  },
  action(state: State) {
    const { execCommand } = useCommand();
    execCommand(syncScroll, state);
  },
};
