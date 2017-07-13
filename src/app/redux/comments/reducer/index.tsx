import * as Immutable from 'seamless-immutable';
import {ICommentAction} from '../ICommentStore';
import * as ActionTypes from '../actions/types';
import IComment from '../../../api/comment/interfaces/IComment';

/** Initial Places State */
const initialState = Immutable.from <ICommentStore>({
  comments: [],
});

export default function commentReducer(state = initialState, action?: ICommentAction) {

  switch (action.type) {
    case ActionTypes.COMMENT_ADD:

      const comments = Immutable.getIn(state, ['comments']);
      const indexOfComment: number = comments.findIndex((a: IComment) => {
        return a.id === action.payload.id;
      });

      if (indexOfComment === -1) {
        const newState = [action.payload].concat(Immutable(state.comments));
        return Immutable({comments: newState});
      } else {
        return state;
      }

    case ActionTypes.COMMENT_UPDATE:
      let currentCommentList;
      currentCommentList = Object.assign({}, state, {});
      currentCommentList.comments[indexOfComment] = action.payload;
      return currentCommentList;

    default :
      return state;

  }
}
