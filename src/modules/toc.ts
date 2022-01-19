import { array } from 'vue-types';

export const tocProps = {
  includeLevel: array<number>().def([2, 3]),
};
