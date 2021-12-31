import useEditor from '@/modules/useEditor';

export { redo as name } from '@/utils/constants/command';

const { editor } = useEditor();

export default function () {
  editor.redo();
}
