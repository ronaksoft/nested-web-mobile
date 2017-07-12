import * as Immutable from 'seamless-immutable';
import {ICommentAction} from '../ICommentStore';
import * as ActionTypes from '../actions/types';
import IComment from '../../../api/comment/interfaces/IComment';

/** Initial Places State */
const initialState = Immutable.from <ICommentStore>({
  comments: [],
});

export default function commentReducer(state = initialState, action?: ICommentAction) {

  // check state for finding comment
  const indexOfComment: number = state.comments.findIndex((c: IComment) => {
    return c.id === action.payload.id;
  });

  switch (action.type) {
    case ActionTypes.COMMENT_ADD:
      /**
       * Place Add Action
       *
       * this part check current application state for finding place and then update place state if place exist.
       * Otherwise add place to places list
       *
       * NOTICE::if this place is exist in state.places, this case will bypass to PLACE_UPDATE
       *
       */
      if (indexOfComment === -1) {
        let comments;
        comments = Immutable.get(state, 'comments');
        comments = comments.concat([action.payload]);
        return state.merge({
          comments,
        });
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
