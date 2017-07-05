import IPlace from '../../api/place/interfaces/IPlace';

export interface IPlaceStore {
  places: IPlace[];
}

export interface IPlaceAction {
  type: string;
  payload: IPlace;
}
