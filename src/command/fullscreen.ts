import useFullscreen from '@/modules/useFullscreen';
export { fullscreen as name } from '@/utils/constants/command';

export default function (fullScreen: boolean) {
  const { toggleFullScreen } = useFullscreen();
  toggleFullScreen(fullScreen);
}
