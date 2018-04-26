import * as Immutable from 'seamless-immutable';
import {IPostAction} from '../IPostStore';
import * as ActionTypes from '../actions/types';
import IPost from '../../../api/post/interfaces/IPost';

/** Initial Posts State */

export default function postReducer(state = {}, action?: IPostAction) {

  switch (action.type) {
    case ActionTypes.POST_ADD:

      if (Array.isArray(action.payload)) {
        const data = {};
        action.payload.forEach((postItem: IPost) => {
          const post: number = state[postItem._id];
          if (!post) {
            data[postItem._id] = postItem;
          }
        });
        return Immutable.merge(state, data);
      } else {
        const post: number = state[action.payload._id];

        if (!post) {
          const data = {};
          data[action.payload._id] = action.payload;
          return Immutable.merge(state, data);
        } else {
          return state;
        }
      }

    case ActionTypes.POST_UPDATE:
      if (!Array.isArray(action.payload)) {
        const data = {};
        data[action.payload._id] = action.payload;
        return Immutable.merge(state, data);
      }

    default :
      return state;

  }
}
