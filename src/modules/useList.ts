import useEditor from './useEditor';
import useHotkeys from './useHotkeys';

const ol = /^\s*([\d]+\.)( \[[ xX]])? /;
const ul = /^\s*([-*])( \[[ xX]])? /;

const ulSyntax = /([*-] |[\d]+\. )/;
const olSyntax = /([\d])+\.( \[[ xX]])? /;

const {
  editor: { getCursorLineLeftText, replaceSelectionText },
} = useEditor();
const { registerHotkeys } = useHotkeys();

const onMounted = () => {
  registerHotkeys({
    key: 'enter',
    preventDefault: false,
    action: (_, e) => {
      if (e.isComposing) return;

      const cursorLineLeftText = getCursorLineLeftText();
      let suffix;
      let syntax;

      if (ol.test(cursorLineLeftText)) {
        suffix = 'x. ';
        syntax = olSyntax;

        e.preventDefault();
      } else if (ul.test(cursorLineLeftText)) {
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

export default () => {
  return {
    onMounted,
  };
};
