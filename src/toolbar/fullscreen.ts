import { fullscreen } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
import useCommand from '@/modules/useCommand';
import useFullscreen from '@/modules/useFullscreen';

const { langConfig } = useLang();
const { execCommand } = useCommand();
const fsSetup = useFullscreen();

export default {
  name: fullscreen,
  icon: 'v-md-icon-fullscreen',
  title: () => {
    const fullscreenLang = langConfig.value.fullscreen;
    return fsSetup.fullscreen.value ? fullscreenLang.disabled : fullscreenLang.enabled;
  },
  active: () => fsSetup.fullscreen.value,
  action() {
    execCommand(fullscreen, !fsSetup.fullscreen.value);
  },
};
