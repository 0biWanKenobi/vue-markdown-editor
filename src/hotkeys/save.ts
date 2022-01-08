import useCommon from '@/modules/useCommon';

export default {
  modifier: 'ctrl',
  key: 's',
  action() {
    const { save } = useCommon();
    save();
  },
};
