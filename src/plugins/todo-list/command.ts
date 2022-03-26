import type State from '@/classes/state';
import useLang from '@/modules/useLang';
import { generatorText } from '@/utils/util';

export default function commandHandler(state: State, { type = 'todo' } = {}) {
  state.insert((selected) => {
    const { langConfig } = useLang();
    const { placeholder } = langConfig.value.task;
    const markup = type === 'todo' ? ' ' : 'x';

    const selectedGetter = (selected: string | undefined) => selected || placeholder;
    const { insertContent, newSelected } = generatorText({
      selected,
      InsertGetter: (selected) => `- [${markup}] ${selectedGetter(selected)}`,
      selectedGetter,
    });

    return {
      text: insertContent,
      selected: newSelected,
    };
  });
}
