import useEditor from '@/modules/useEditor';

import { redo as name } from '@/utils/constants/command';

const command = () => {
  const { editor } = useEditor();
  editor.redo();
};

Object.defineProperty(command, 'name', { value: name });

export default command;
