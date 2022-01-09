type CreateToolbarParams = {
  commandName: string;
  text?: string;
  icon: string;
  title: () => string;
  [x: string]: any;
};

export default CreateToolbarParams;
