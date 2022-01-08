import useEditor from '@/modules/useEditor';
import { undo as name } from '@/utils/constants/command';

const { editor } = useEditor();

const command = () => {
  editor.undo();
};

Object.defineProperty(command, 'name', { value: name });

export default command;
