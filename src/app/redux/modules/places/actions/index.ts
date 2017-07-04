import IPlace from 'api/place/interfaces/IPlace';
import {IPlaceAction} from '../IPlaceStore';
import * as ActionTypes from './types';

export function placeAdd(place: IPlace): IPlaceAction {
  return {
    type: ActionTypes.PLACE_ADD,
    payload: place,
  };
}

export function placeUpdate(place: IPlace): IPlaceAction {
  return {
    type: ActionTypes.PLACE_UPDATE,
    payload: place,
  };
}
