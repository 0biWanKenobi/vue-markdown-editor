import { fullscreen as name } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
import type State from '@/classes/state';
import useCommand from '@/modules/useCommand';

const { langConfig } = useLang();

export default {
  name: name,
  icon: 'v-md-icon-fullscreen',
  title: (state: State) => {
    const fullscreen = state.fullScreen.active.value === true;
    const fullscreenLang = langConfig.value.fullscreen;
    return fullscreen ? fullscreenLang.disabled : fullscreenLang.enabled;
  },
  active: (state: State) => state?.fullScreen.active.value === true,
  action(state: State) {
    const { execCommand } = useCommand();
    execCommand(name, state);
  },
};
