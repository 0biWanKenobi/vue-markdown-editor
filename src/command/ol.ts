import useCommon from '@/modules/useCommon';
import useLang from '@/modules/useLang';
import { generatorText } from '@/utils/util';

const { insert } = useCommon();
const { langConfig } = useLang();

export { ol as name } from '@/utils/constants/command';

export default function () {
  insert((selected) => {
    const { placeholder } = langConfig.value.ol;

    const selectedGetter = (selected: string) => selected || placeholder;
    const { insertContent, newSelected } = generatorText({
      selected,
      InsertGetter: (selected: string, rowIndex: string | number) =>
        `${rowIndex}. ${selectedGetter(selected)}`,
      selectedGetter,
      ignoreEmptyLine: false,
    });

    return {
      text: insertContent,
      selected: newSelected,
    };
  });
}
