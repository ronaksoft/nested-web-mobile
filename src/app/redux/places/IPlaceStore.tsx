import {IPlace} from '../../api/interfaces/';

export interface IPlaceStore {
  places: IPlace[];
}

export interface IPlaceAction {
  type: string;
  payload?: IPlace;
}
