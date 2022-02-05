import Toolbar from '@/types/toolbarType';
import * as DefaultToolbarItems from '@/toolbar';

const toolbars: Record<string, Toolbar> = {};

const addToolbar = (toolbar: Toolbar) => {
  toolbars[toolbar.name] = toolbar;
};

const addDefaultToolbars = () => {
  for (const defaultToolbar of Object.values(DefaultToolbarItems)) {
    toolbars[defaultToolbar.name] = defaultToolbar;
  }
};

const getToolbarItem = (itemName: string) => {
  return toolbars[itemName];
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
    getToolbarItem,
  };
};
