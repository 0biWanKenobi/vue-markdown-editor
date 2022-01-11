import useSyncScroll from '@/modules/useSyncScroll';
import { syncScroll as name } from '@/utils/constants/command';

const command = (isEnable: boolean) => {
  const { toggleSyncScroll } = useSyncScroll();
  toggleSyncScroll(isEnable);
};

Object.defineProperty(command, 'name', { value: name });

export default command;
