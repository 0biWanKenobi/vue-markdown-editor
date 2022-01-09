type PluginCreatorParams = {
  name: string;
  icon: string;
  text: string;
  color: string;
  title: () => string;
  [x: string]: any;
};

export default PluginCreatorParams;
