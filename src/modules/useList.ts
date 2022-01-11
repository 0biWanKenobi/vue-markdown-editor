import LifecycleStage from '@/types/lifecycleStage';
import { ref } from 'vue';
import useEditor from './useEditor';
import useHotkeys from './useHotkeys';

const ol = /^\s*([\d]+\.)( \[[ xX]])? /;
const ul = /^\s*([-*])( \[[ xX]])? /;

const ulSyntax = /([*-] |[\d]+\. )/;
const olSyntax = /([\d])+\.( \[[ xX]])? /;

const onMounted = () => {
  const { registerHotkeys } = useHotkeys();
  registerHotkeys({
    key: 'enter',
    preventDefault: false,
    action: (_: any, e: any) => {
      if (e.isComposing) return;

      const {
        editor: { getCursorLineLeftText, replaceSelectionText },
      } = useEditor();

      const cursorLineLeftText = getCursorLineLeftText();
      let suffix;
      let syntax;

      if (cursorLineLeftText && ol.test(cursorLineLeftText)) {
        suffix = 'x. ';
        syntax = olSyntax;

        e.preventDefault();
      } else if (cursorLineLeftText && ul.test(cursorLineLeftText)) {
        suffix = '- ';
        syntax = ulSyntax;

        e.preventDefault();
      } else {
        return;
      }

      const indent = cursorLineLeftText.search(syntax);
      const suffixIndex = indent + suffix.length;
      let beforeText = cursorLineLeftText.slice(0, suffixIndex);
      const content = cursorLineLeftText.slice(suffixIndex, cursorLineLeftText.length);

      if (content) {
        if (suffix === 'x. ') {
          beforeText = beforeText.replace(/(\d+)/, (parseInt(beforeText) + 1).toString());
        }

        replaceSelectionText(`\n${beforeText}`, 'end');
      }
    },
  });
};

const areHooksSaved = ref(false);

export default () => {
  if (!areHooksSaved.value) {
    areHooksSaved.value = true;

    const { setLifeCycleHooks } = useEditor();
    setLifeCycleHooks(LifecycleStage.mounted, onMounted);
  }
};
