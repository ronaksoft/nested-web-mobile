import IComment from 'api/comment/interfaces/IComment';
import {ICommentAction} from '../ICommentStore';
import * as ActionTypes from './types';

export function commentAdd(comment: IComment): ICommentAction {
  return {
    type: ActionTypes.COMMENT_ADD,
    payload: comment,
  };
}

export function commentUpdate(comment: IComment): ICommentAction {
  return {
    type: ActionTypes.COMMENT_UPDATE,
    payload: comment,
  };
}
