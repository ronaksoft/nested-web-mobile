import * as Immutable from 'seamless-immutable';
import {IPlaceAction} from '../IPlaceStore';
import * as ActionTypes from '../actions/types';
import IPlace from '../../../api/place/interfaces/IPlace';

/** Initial Places State */
const initialState = Immutable.from <IPlaceStore>({
  places: [],
});

export default function placeReducer(state = initialState, action?: IPlaceAction) {

  // check state for finding place
  const indexOfPlace: number = state.places.findIndex((p: IPlace) => {
    return p._id === action.payload._id;
  });

  switch (action.type) {
    case ActionTypes.PLACE_ADD:
      /**
       * Place Add Action
       *
       * this part check current application state for finding place and then update place state if place exist.
       * Otherwise add place to places list
       *
       * NOTICE::if this place is exist in state.places, this case will bypass to PLACE_UPDATE
       *
       */
      if (indexOfPlace === -1) {
        let places;
        places = Immutable.get(state, 'places');
        places = places.concat([action.payload]);
        return state.merge({
          places,
        });
      }

    case ActionTypes.PLACE_UPDATE:
      let currentPlaceList;
      currentPlaceList = Object.assign({}, state, {});
      currentPlaceList.places[indexOfPlace] = action.payload;
      return currentPlaceList;

    default :
      return state;

  }
}
