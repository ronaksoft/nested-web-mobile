interface IMenuItem {
  onClick?: () => void;
  icon?: any;
  name: any;
  type?: string;
  additional?: string;
  isChecked: boolean;
}

export default IMenuItem;
