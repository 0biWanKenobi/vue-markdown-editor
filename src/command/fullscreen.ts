import useFullscreen from '@/modules/useFullscreen';
import { fullscreen as name } from '@/utils/constants/command';

const command = (fullScreen: boolean) => {
  const { toggleFullScreen } = useFullscreen();
  toggleFullScreen(fullScreen);
};

Object.defineProperty(command, 'name', { value: name });

export default command;
