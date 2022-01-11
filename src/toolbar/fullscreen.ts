import { fullscreen as name } from '@/utils/constants/command';
import command from '@/command/fullscreen';
import useLang from '@/modules/useLang';
import useFullscreen from '@/modules/useFullscreen';

const { langConfig } = useLang();

export default {
  name: name,
  icon: 'v-md-icon-fullscreen',
  title: () => {
    const { fullscreen } = useFullscreen();
    const fullscreenLang = langConfig.value.fullscreen;
    return fullscreen.value ? fullscreenLang.disabled : fullscreenLang.enabled;
  },
  active: () => useFullscreen().fullscreen.value,
  action() {
    command(!useFullscreen().fullscreen.value);
  },
};
