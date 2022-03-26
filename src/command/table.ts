import type State from '@/classes/state';
import { table as name } from '@/utils/constants/command';

const command = (state: State) => {
  state.insert(() => {
    const content = '|column1|column2|column3|\n|-|-|-|\n|content1|content2|content3|';

    return {
      text: content,
      selected: 'column1',
    };
  });
};

Object.defineProperty(command, 'name', { value: name });

export default command;
