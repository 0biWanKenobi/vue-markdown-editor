import useCommon from '@/modules/useCommon';
import useLang from '@/modules/useLang';
import { generatorText } from '@/utils/util';

const { insert } = useCommon();
const { langConfig } = useLang();

export { strikethrough as name } from '@/utils/constants/command';

export default function () {
  insert((selected) => {
    const prefix = '~~';
    const suffix = '~~';
    const { placeholder } = langConfig.value.strikethrough;

    const selectedGetter = (selected) => selected || placeholder;
    const { insertContent, newSelected } = generatorText({
      selected,
      InsertGetter: (selected) => `${prefix}${selectedGetter(selected)}${suffix}`,
      selectedGetter,
    });

    return {
      text: insertContent,
      selected: newSelected,
    };
  });
}
