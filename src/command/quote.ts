import useCommon from '@/modules/useCommon';
import useLang from '@/modules/useLang';
export { quote as name } from '@/utils/constants/command';

const { insert } = useCommon();
const { langConfig } = useLang();

export default function () {
  insert((selected) => {
    const prefix = '>';
    const content = selected || langConfig.value.quote.placeholder;

    return {
      text: `${prefix} ${content}`,
      selected: content,
    };
  });
}
