import type State from '@/classes/state';

type Toolbar = {
  name: string;
  icon?: string;
  text?: string;
  active?: (state: State) => boolean;
  preventNativeClick?: boolean;
  title: (state: State) => string;
  action?: (state: State) => void;
  menus?: any;
  slot?: boolean;
};

export default Toolbar;
