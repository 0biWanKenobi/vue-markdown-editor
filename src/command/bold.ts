import useCommon from '@/modules/useCommon';
import useLang from '@/modules/useLang';
import { generatorText } from '@/utils/util';

export { bold as name } from '@/utils/constants/command';

const { insert } = useCommon();
const { langConfig } = useLang();

export default function () {
  insert((selected) => {
    const prefix = '**';
    const suffix = '**';
    const { placeholder }: { placeholder: string } = langConfig.value.bold;

    const selectedGetter = (v: string | undefined) => v || placeholder;
    const { insertContent, newSelected } = generatorText({
      selected,
      InsertGetter: (selected?: string) => `${prefix}${selectedGetter(selected)}${suffix}`,
      selectedGetter,
    });

    return {
      text: insertContent,
      selected: newSelected,
    };
  });
}
