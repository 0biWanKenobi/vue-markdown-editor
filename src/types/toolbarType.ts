type Toolbar = {
  name: string;
  icon?: string;
  text?: string;
  active?: () => boolean;
  preventNativeClick?: boolean;
  title: () => string;
  action?: () => void;
  menus?: any;
  slot?: boolean;
};

export default Toolbar;
