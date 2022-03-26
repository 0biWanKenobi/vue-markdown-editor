import { h1, h2, h3, h4, h5, h6 } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
import type State from '@/classes/state';
import useCommand from '@/modules/useCommand';

const { langConfig } = useLang();
const { execCommand } = useCommand();

export default {
  name: 'h',
  text: 'H',
  title: () => `${langConfig.value.h.toolbar}（Ctrl+1~6）`,
  menus: [
    {
      name: h1,
      text: () => langConfig.value.h1.toolbar,
      action(state: State) {
        execCommand(h1, state);
      },
    },
    {
      name: h2,
      text: () => langConfig.value.h2.toolbar,
      action(state: State) {
        execCommand(h2, state);
      },
    },
    {
      name: h3,
      text: () => langConfig.value.h3.toolbar,
      action(state: State) {
        execCommand(h3, state);
      },
    },
    {
      name: h4,
      text: () => langConfig.value.h4.toolbar,
      action(state: State) {
        execCommand(h4, state);
      },
    },
    {
      name: h5,
      text: () => langConfig.value.h5.toolbar,
      action(state: State) {
        execCommand(h5, state);
      },
    },
    {
      name: h6,
      text: () => langConfig.value.h6.toolbar,
      action(state: State) {
        execCommand(h6, state);
      },
    },
  ],
};
