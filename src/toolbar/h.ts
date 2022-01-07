import { h1, h2, h3, h4, h5, h6 } from '@/utils/constants/command';
import useLang from '@/modules/useLang';
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
      action() {
        execCommand(h1);
      },
    },
    {
      name: h2,
      text: () => langConfig.value.h2.toolbar,
      action() {
        execCommand(h2);
      },
    },
    {
      name: h3,
      text: () => langConfig.value.h3.toolbar,
      action() {
        execCommand(h3);
      },
    },
    {
      name: h4,
      text: () => langConfig.value.h4.toolbar,
      action() {
        execCommand(h4);
      },
    },
    {
      name: h5,
      text: () => langConfig.value.h5.toolbar,
      action() {
        execCommand(h5);
      },
    },
    {
      name: h6,
      text: () => langConfig.value.h6.toolbar,
      action() {
        execCommand(h6);
      },
    },
  ],
};
