import Toolbar from '@/types/toolbarType';
import * as DefaultToolbarItems from '@/toolbar';

const toolbars: Record<string, Toolbar> = {};

const addToolbar = (toolbar: Toolbar) => {
  toolbars[toolbar.name] = toolbar;
};

const addDefaultToolbars = () => {
  for (let defaultToolbar of Object.values(DefaultToolbarItems)) {
    toolbars[defaultToolbar.name] = defaultToolbar;
  }
};

const registerToolbar = (name: string, config: Toolbar) => {
  addToolbar(config);
};
const handleToolbarItemClick = (toolbarItem: Toolbar) => {
  if (
    toolbarItem.action &&
    !toolbarItem.menus?.length &&
    typeof toolbarItem.action === 'function'
  ) {
    toolbarItem.action.call(toolbarItem, this, toolbars[toolbarItem.name]);
  }
};
const handleToolbarMenuClick = (menu: Toolbar) => {
  if (menu.action && typeof menu.action === 'function') {
    menu.action.call(menu, this, toolbars[menu.name]);
  }
};

export default () => {
  return {
    toolbars,
    addToolbar,
    addDefaultToolbars,
    registerToolbar,
    handleToolbarItemClick,
    handleToolbarMenuClick,
  };
};
