import useCommon from '@/modules/useCommon';
import { code as name } from '@/utils/constants/command';

const command = () => {
  const { insert } = useCommon();
  insert((selected) => {
    const prefix = '``` language';
    const suffix = '```';
    let text = `${prefix}\n${suffix}`;

    if (selected) {
      text = `${prefix}\n  ${selected}\n${suffix}`;
    }

    return {
      text,
      selected: 'language',
    };
  });
};

Object.defineProperty(command, 'name', { value: name });

export default command;
