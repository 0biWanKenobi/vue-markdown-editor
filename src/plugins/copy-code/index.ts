import useEditor from '@/modules/useEditor';
import useVMdParser from '@/modules/useVMdParser';
import parser from './parser';
import createCopyCodePreview from './preview';

export default function createCopyCodePlugin() {
  return {
    install() {
      const vMdParser = useVMdParser();
      vMdParser.use(parser);

      const { editor: VMdEditor } = useEditor();
      VMdEditor.use(createCopyCodePreview());
    },
  };
}
