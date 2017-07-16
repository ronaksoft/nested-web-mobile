import IPlace from '../../api/place/interfaces/IPlace';
import IMenuItem from './IMenuItem';

interface ILeftItem {
  name: any;
  place?: IPlace | null;
  menu: IMenuItem[];
  type: string;
}

export default ILeftItem;
