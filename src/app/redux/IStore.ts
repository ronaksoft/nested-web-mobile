import IUser from '../api/account/interfaces/IUser';
import IPlace from '../api/place/interfaces/IPlace';

export interface IStore {
  places: IPlace;
  accounts: IUser[];
  user: IUser;
}
