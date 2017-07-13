import * as Immutable from 'seamless-immutable';
import {IPostAction} from '../IPostStore';
import * as ActionTypes from '../actions/types';
import IPost from '../../../api/post/interfaces/IPost';

/** Initial Posts State */
const initialState = Immutable.from <IPostStore>({
  posts: [],
});

export default function postReducer(state = initialState, action?: IPostAction) {

  switch (action.type) {
    case ActionTypes.POST_ADD:

      const posts = Immutable.getIn(state, ['posts']);
      const indexOfPost: number = posts.findIndex((a: IPost) => {
        return a._id === action.payload._id;
      });

      if (indexOfPost === -1) {
        const newState = [action.payload].concat(Immutable(state.posts));
        return Immutable({posts: newState});
      } else {
        return state;
      }

    case ActionTypes.POST_UPDATE:
      let currentPostList;
      currentPostList = Object.assign({}, state, {});
      currentPostList.posts[indexOfPost] = action.payload;
      return currentPostList;

    default :
      return state;

  }
}
