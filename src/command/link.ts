import useCommon from '@/modules/useCommon';
import useLang from '@/modules/useLang';
import { generatorText } from '@/utils/util';

import { link as name } from '@/utils/constants/command';

const command = () => {
  const { insert } = useCommon();

  insert((selected) => {
    const { langConfig } = useLang();
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
};

Object.defineProperty(command, 'name', { value: name });

export default command;
