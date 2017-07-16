interface IMenuItem {
  onClick?: () => void;
  icon?: any;
  name: string;
  type?: string;
  additional?: string;
  isChecked: boolean;
}

export default IMenuItem;
