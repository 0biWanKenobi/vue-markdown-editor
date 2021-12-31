import useCommon from '@/modules/useCommon';
export { code as name } from '@/utils/constants/command';

const { insert } = useCommon();

export default function () {
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
}
