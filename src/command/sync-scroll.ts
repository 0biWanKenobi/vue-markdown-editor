import useSyncScroll from '@/modules/useSyncScroll';
import { syncScroll as name } from '@/utils/constants/command';

const { toggleSyncScroll } = useSyncScroll();

const command = (isEnable: boolean) => {
  toggleSyncScroll(isEnable);
};

Object.defineProperty(command, 'name', { value: name });

export default command;
