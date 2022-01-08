import useCommon from '@/modules/useCommon';
import { hr as name } from '@/utils/constants/command';

const { insert } = useCommon();

const command = () => {
  insert(() => ({
    text: '------------------------------------',
  }));
};

Object.defineProperty(command, 'name', { value: name });

export default command;
