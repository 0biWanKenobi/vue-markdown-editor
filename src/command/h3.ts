import useCommon from '@/modules/useCommon';
import useLang from '@/modules/useLang';
import { generatorText } from '@/utils/util';

export { h3 as name } from '@/utils/constants/command';

const { insert } = useCommon();
const { langConfig } = useLang();

export default function () {
  insert((selected) => {
    const prefix = '###';
    const { placeholder } = langConfig.value.h3;

    const selectedGetter = (selected: string | undefined) => selected || placeholder;
    const { insertContent, newSelected } = generatorText({
      selected,
      InsertGetter: (selected) => `${prefix} ${selectedGetter(selected)}`,
      selectedGetter,
    });

    return {
      text: insertContent,
      selected: newSelected,
    };
  });
}
