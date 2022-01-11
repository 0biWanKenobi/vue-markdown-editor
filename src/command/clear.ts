import useEditor from '@/modules/useEditor';
import { clear as name } from '@/utils/constants/command';

const command = () => {
  const {
    editor: { clear },
  } = useEditor();
  clear();
};

Object.defineProperty(command, 'name', { value: name });

export default command;
