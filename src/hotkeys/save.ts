import useCommon from '@/modules/useCommon';
import { HotKey } from '@/types/hotKeyType';

export default <HotKey>{
  modifier: 'ctrl',
  key: 's',
  action() {
    const { save } = useCommon();
    save();
  },
};
