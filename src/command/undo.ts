import useEditor from '@/modules/useEditor';
export { undo as name } from '@/utils/constants/command';

const { editor } = useEditor();

export default function () {
  editor.undo();
}
