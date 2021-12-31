import useCommon from '@/modules/useCommon';
import useLang from '@/modules/useLang';
import { generatorText } from '@/utils/util';

const { insert } = useCommon();
const { langConfig } = useLang();

export { link as name } from '@/utils/constants/command';

export default function () {
  insert((selected) => {
    const { descPlaceholder } = langConfig.value.link;
    const linkPlaceholder = 'http://';

    const { insertContent, newSelected } = generatorText({
      selected,
      InsertGetter: (selected) => `[${selected || descPlaceholder}](${linkPlaceholder})`,
      selectedGetter: (selected) => (selected ? linkPlaceholder : descPlaceholder),
    });

    return {
      text: insertContent,
      selected: newSelected,
    };
  });
}
