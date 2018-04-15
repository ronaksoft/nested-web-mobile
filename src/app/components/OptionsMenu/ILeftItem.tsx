import {IPlace} from 'api/interfaces';
import IMenuItem from './IMenuItem';

interface ILeftItem {
  name: any;
  place?: IPlace | null;
  menu: IMenuItem[];
  type: string;
}

export default ILeftItem;
