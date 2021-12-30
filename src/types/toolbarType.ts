import { Component } from 'vue';

type Toolbar = {
  name: string;
  icon?: string;
  title: (editor: Component) => string;
  action?: (editor: Component) => void;
  menus?: Array<any>;
};

export default Toolbar;
