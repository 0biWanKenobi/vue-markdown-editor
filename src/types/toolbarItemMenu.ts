type Menu = {
  name: string;
  class: string;
  render: Function;
  text: string | (() => string);
  action: Function;
};

export default Menu;
