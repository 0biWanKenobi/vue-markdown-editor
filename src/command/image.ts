import useCommon from '@/modules/useCommon';
import { image as name } from '@/utils/constants/command';

const { insert } = useCommon();

type Image = {
  url?: string;
  desc?: string;
  width?: string | number;
  height?: string | number;
};

const command = ({ url, desc, width, height }: Image = {}) => {
  insert(() => {
    const urlPlaceholder = 'http://';
    const descPlaceholder = 'Description';
    let selected: string | undefined = urlPlaceholder;
    let text = `![${desc || descPlaceholder}](${url || urlPlaceholder})`;
    const style = [];

    if (width) {
      style.push(`width="${width}"`);
    }

    if (height) {
      style.push(`height="${height}"`);
    }

    if (style.length) {
      text += `{{{${style.join(' ')}}}}`;
    }

    if (url && desc) {
      selected = undefined;
    } else if (url) {
      selected = descPlaceholder;
    } else if (desc) {
      selected = urlPlaceholder;
    }

    return {
      text,
      selected,
    };
  });
};

Object.defineProperty(command, 'name', { value: name });

export default command;
