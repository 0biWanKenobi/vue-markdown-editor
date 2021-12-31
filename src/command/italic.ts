import useCommon from '@/modules/useCommon';
import useLang from '@/modules/useLang';
import { generatorText } from '@/utils/util';

const { insert } = useCommon();
const { langConfig } = useLang();

export { italic as name } from '@/utils/constants/command';

export default function () {
  insert((selected) => {
    const prefix = '*';
    const suffix = '*';
    const { placeholder } = langConfig.value.italic;

    const selectedGetter = (selected: string) => selected || placeholder;
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
