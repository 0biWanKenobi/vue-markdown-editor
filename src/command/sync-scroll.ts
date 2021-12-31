import useSyncScroll from '@/modules/useSyncScroll';
export { syncScroll as name } from '@/utils/constants/command';

const { toggleSyncScroll } = useSyncScroll();

export default function (isEnable: boolean) {
  toggleSyncScroll(isEnable);
}
