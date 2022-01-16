import Toolbar from '@/types/toolbarType';
import * as DefaultToolbarItems from '@/toolbar';
import Menu from '@/types/toolbarItemMenu';

const toolbars: Record<string, Toolbar> = {};

const addToolbar = (toolbar: Toolbar) => {
  toolbars[toolbar.name] = toolbar;
};

const addDefaultToolbars = () => {
  for (const defaultToolbar of Object.values(DefaultToolbarItems)) {
    toolbars[defaultToolbar.name] = defaultToolbar;
  }
};

const handleToolbarItemClick = (itemName: string) => {
  const toolbarItem = toolbars[itemName];
  if (
    toolbarItem.action &&
    !toolbarItem.menus?.length &&
    typeof toolbarItem.action === 'function'
  ) {
    toolbarItem.action();
  }
};

const handleToolbarMenuClick = (menu: Menu) => {
  if (menu.action && typeof menu.action === 'function') {
    menu.action();
  }
};

const registerToolbars = (toolbarConfig: Record<string, Toolbar>) => {
  for (const key of Object.keys(toolbarConfig)) {
    const toolbar = toolbarConfig[key];
    toolbar.name = key;
    addToolbar(toolbar);
  }
};

export default () => {
  return {
    toolbars,
    addToolbar,
    addDefaultToolbars,
    registerToolbars,
    handleToolbarItemClick,
    handleToolbarMenuClick,
  };
};
