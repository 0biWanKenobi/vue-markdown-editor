import useEditor from '@/modules/useEditor';
export { clear as name } from '@/utils/constants/command';
const {
  editor: { clear },
} = useEditor();

export default function () {
  clear();
}
