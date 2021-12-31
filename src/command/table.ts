import useCommon from '@/modules/useCommon';
export { table as name } from '@/utils/constants/command';

const { insert } = useCommon();

export default function () {
  insert(() => {
    const content = '|column1|column2|column3|\n|-|-|-|\n|content1|content2|content3|';

    return {
      text: content,
      selected: 'column1',
    };
  });
}
