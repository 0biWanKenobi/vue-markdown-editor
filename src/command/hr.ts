import useCommon from '@/modules/useCommon';
import { hr as name } from '@/utils/constants/command';

const command = () => {
  const { insert } = useCommon();
  insert(() => ({
    text: '------------------------------------',
  }));
};

Object.defineProperty(command, 'name', { value: name });

export default command;
