import useLang from '@/modules/useLang';
import useCommon from '@/modules/useCommon';
import { generatorText } from '@/utils/util';

const { insert } = useCommon();
const { langConfig } = useLang();

export { h4 as name } from '@/utils/constants/command';

export default function () {
  insert((selected) => {
    const prefix = '####';
    const { placeholder } = langConfig.value.h4;

    const selectedGetter = (selected: string) => selected || placeholder;
    const { insertContent, newSelected } = generatorText({
      selected,
      InsertGetter: (selected: string) => `${prefix} ${selectedGetter(selected)}`,
      selectedGetter,
    });

    return {
      text: insertContent,
      selected: newSelected,
    };
  });
}
