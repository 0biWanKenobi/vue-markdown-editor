import Toolbar from '@/types/toolbarType';
import * as DefaultToolbarItems from '@/toolbar';

class ToolbarManager {
  toolbars: Record<string, Toolbar> = {};

  addToolbar = (toolbar: Toolbar) => {
    this.toolbars[toolbar.name] = toolbar;
  };

  addDefaultToolbars = () => {
    for (const defaultToolbar of Object.values(DefaultToolbarItems)) {
      this.toolbars[defaultToolbar.name] = defaultToolbar;
    }
  };

  getToolbarItem = (itemName: string) => {
    return this.toolbars[itemName];
  };

  registerToolbars = (toolbarConfig: Record<string, Toolbar>) => {
    for (const key of Object.keys(toolbarConfig)) {
      const toolbar = toolbarConfig[key];
      toolbar.name = key;
      this.addToolbar(toolbar);
    }
  };
}

export default ToolbarManager;
