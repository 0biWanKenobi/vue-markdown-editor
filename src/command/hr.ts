import useCommon from '@/modules/useCommon';
export { hr as name } from '@/utils/constants/command';

const { insert } = useCommon();

export default function () {
  insert(() => ({
    text: '------------------------------------',
  }));
}
